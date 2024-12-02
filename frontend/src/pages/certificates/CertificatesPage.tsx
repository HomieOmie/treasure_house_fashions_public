import { Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar';
import Alert from 'react-bootstrap/Alert';
import Certificate from './Certificate';
import CertificateCreator from './CertificateCreator';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { downloadCertificates } from './helper';
import { certificate, CertificatesAddParams } from '../../interfaces';
import { Footer } from '../../components/Footer';

function CertificatesPage() {

    const [certificates, setCertificates] = useState<certificate[]>([]);
    const [displayedCertificates, setDisplayedCertificates] = useState<certificate[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [alertType, setAlertType] = useState('');
    const [alertMsg, setAlertMsg] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // search states
    const [searchId, setSearchId] = useState('');
    const [searchAgency, setSearchAgency] = useState('');
    const [searchStartDate, setSearchStartDate] = useState('');
    const [searchEndDate, setSearchEndDate] = useState('');
    const [searchPageSize, setSearchPageSize] = useState(pageSize);
    const [searchOnlyRedeemed, setSearchOnlyRedeemed] = useState(false);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const token = localStorage.getItem('token');
                // Perform your asynchronous data fetching here
                const response = await fetch('https://thf-node-server-s64bwmcpia-uk.a.run.app/gift_certificates', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ jwtToken: token })
                });
                if (!response.ok) {
                    setAlertType('danger');
                    setAlertMsg('Error fetching gift certificates');
                }
                const responseData = await response.json();
                console.log(responseData);
                const data = responseData.data
                console.log(data);
                // sort by date redeemed then agency name
                data.sort((a: certificate, b: certificate) => {
                    if (a.dateRedeemed && b.dateRedeemed) {
                        return b.dateRedeemed.localeCompare(a.dateRedeemed);
                    } else if (a.dateRedeemed) {
                        return -1;
                    } else if (b.dateRedeemed) {
                        return 1;
                    } else {
                        return a.agency.name.localeCompare(b.agency.name);
                    }
                })
                setCertificates(data); // Update state with fetched data
                setDisplayedCertificates(data);
            } catch (error: any) {
                setAlertType('danger');
                setAlertMsg(error.message);
            }
        };

        fetchCertificates(); // Call the fetch function when the component mounts
    }, []);

    // format: [column name, column width]
    const columnInfo: [string, number][] = [
        ["Agency Name", 2],
        ["Amount", 1],
        ["Percentage Redeemed", 1],
        ["Clothing Value Redeemed", 2],
        ["Created On", 1],
        ["Date Redeemed", 1],
        ["Actions", 4]
    ]

    const setAlert = (type: string, msg: string) => {
        setAlertType(type);
        setAlertMsg(msg);
        setTimeout(() => {
            setAlertType('');
            setAlertMsg('');
        }, 5000);
    }

    // TODO: After ordering by datetime created, show the most recent ones
    const generateGiftCertificates = async ({ agencyId, amount, num }: CertificatesAddParams) => {
        const token = localStorage.getItem('token');
        if (num <= 0) {
            setAlert('danger', 'Number of certificates created must be greater than 0');
            return;
        }
        if (amount <= 0) {
            setAlert('danger', 'Amount for each certificate must be greater than 0');
            return;
        }
        if (!agencyId) {
            setAlert('danger', 'Please select an agency to create gift certificates for.');
            return;
        }
        const dateCreated = new Date();
        const errMsg: string[] = [];
        const certs: certificate[] = [];
        for (let i = 0; i < num; i++) {
            await fetch('https://thf-node-server-s64bwmcpia-uk.a.run.app/create_gift_certificates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ agencyId, amount, dateCreated, jwtToken: token }),
            })
            .then(async (response) => {
                if (response.ok) {
                    const responseData = await response.json();
                    const data = responseData.data
                    certs.push(data as certificate);
                }       
            })
            .catch((error) => {
                errMsg.push(error.message);
            });
            if (errMsg.length > 0) {
                setAlert('danger', errMsg[0] + `: ${i}/${num} certificates created for ${amount} each.`);
                // createAndDownloadCertificate(certs);
                return;
            }
        }
        // TODO: make creation of gift certificates reactive
        setAlertType('success');
        setAlertMsg(`Successfully created ${num} gift certificates for $${amount} each. Please refresh the page to view them.`);
        setIsCreating(false);
        downloadCertificates(certs);
        // scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Put as a separate function as running just setPage runs into concurrency issues
    const setNewPage = (newPage: number) => {
        setPage(newPage);
    }

    const goToFilter = () => {
        const range = document.createRange();
        range.selectNode(document.getElementById('search-filter') as Node);
        range.getBoundingClientRect();
        const y = range.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }

    /**
     * Filters the certificates based on the search criteria and updates the displayed certificates
     * Ignore the search criterias where the field is empty
    */
    const validateSearchParams = () => {
        if (searchStartDate && !Date.parse(searchStartDate)) {
            setAlert('danger', 'Invalid date format for start date. Please use the format YYYY-MM-DD');
            return false;
        } else if (searchEndDate && !Date.parse(searchEndDate)) {
            setAlert('danger', 'Invalid date format for end date. Please use the format YYYY-MM-DD');
            return false;
        } else if (Date.parse(searchStartDate) > Date.parse(searchEndDate)) {
            setAlert('danger', 'Start date cannot be after end date');
            return false;
        }
        return true;
    }

    const searchCertificates = () => {
        if (!validateSearchParams()) return;
        const filteredCertificates = certificates.filter((c) =>
            (!searchId || c.id.includes(searchId)) &&
            (!searchAgency || c.agency.name.includes(searchAgency)) &&
            (!searchStartDate || new Date(c.dateCreated) >= new Date(searchStartDate)) &&
            (!searchEndDate || new Date(c.dateCreated) <= new Date(searchEndDate)) &&
            (!searchOnlyRedeemed || c.dateRedeemed)
        );
        setPage(0);
        setPageSize(searchPageSize);
        setDisplayedCertificates(filteredCertificates);
        setAlert('success', 'Search successful');
        // scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // set the tab title
    document.title = 'All Certificates';
    return (
        <Container>
            <TopBar /> { /* TODO: replace with actual user when authentication is incorporated */}
            {alertType === 'success' && <Alert key={alertMsg} variant={alertType} id="alertMsg">{alertMsg}</Alert>}
            <Row>
                <h2>{"Gift Certificates"}</h2>
                <Button className="col-sm-4 col-md-2 mb-3" id="start-filter" onClick={goToFilter}>
                    {"Find Certificates"}
                </Button>
                <Table responsive>
                    <thead>
                        {/* colSpan must be at least 1 and varies according to how 
                            many columns the item will take */}
                        {columnInfo.map(([name, width]) =>
                            <th key={name}
                                className={`list-title col-${width}`}
                                colSpan={Math.max(Math.floor(width / 2), 1)}>
                                {name}
                            </th>)}
                    </thead>
                    <tbody>
                        {displayedCertificates.slice(page * pageSize, (page + 1) * pageSize).map((c) => (Certificate(c)))}
                    </tbody>
                </Table>
                <div className="pagination">
                    <Button variant="outline-primary"
                        onClick={() => setNewPage(page - 1)}
                        disabled={page === 0}
                    >
                        {"<< Prev"}
                    </Button>
                    <span className="page-num">{`${page + 1} / ${Math.ceil(displayedCertificates.length / pageSize)}`}</span>
                    <Button variant="outline-primary"
                        onClick={() => setNewPage(page + 1)}
                        disabled={(page + 1) * pageSize >= displayedCertificates.length}
                    >
                        {"Next >>"}
                    </Button>
                </div>
            </Row>

            <Row id="search-filter">
                <h2>Search and Filters</h2>
                <Form className="search-filters" onSubmit={(e) => {
                    e.preventDefault();
                    searchCertificates()
                }}>
                    <Row>
                        <Form.Group as={Col} controlId="search-cert-by-id">
                            <Form.Label>Certificate ID:</Form.Label>
                            <Form.Control value={searchId} onChange={(e) => setSearchId(e.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="search-cert-by-agencies">
                            <Form.Label>AgencyName:</Form.Label>
                            <Form.Control value={searchAgency} onChange={(e) => setSearchAgency(e.target.value)} />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col} controlId="search-cert-by-start-date">
                            <Form.Label>From:</Form.Label>
                            <Form.Control value={searchStartDate} onChange={(e) => setSearchStartDate(e.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="search-cert-by-end-date">
                            <Form.Label>To:</Form.Label>
                            <Form.Control value={searchEndDate} onChange={(e) => setSearchEndDate(e.target.value)} />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col} controlId="display-per-page">
                            <Form.Label>Number of Certificates Per Page:</Form.Label>
                            <Form.Control type="number"
                                value={searchPageSize}
                                min={1}
                                onChange={(e) => setSearchPageSize(parseInt(e.target.value || "1"))}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="show-only-redeemed">
                            <Form.Label>Show Only Redeemed Certificates:</Form.Label>
                            <Form.Check type="checkbox"
                                value={searchOnlyRedeemed.toString()}
                                onChange={() => {
                                    setSearchOnlyRedeemed(!searchOnlyRedeemed);
                                }} />
                        </Form.Group>
                    </Row>
                    <Row className="search-options">
                        <Button variant="secondary" className={"col-sm-4 col-md-2 col-lg-1"} onClick={() => {
                            setSearchId('');
                            setSearchAgency('');
                            setSearchStartDate('');
                            setSearchEndDate('');
                            setSearchPageSize(pageSize);
                            setSearchOnlyRedeemed(false);
                        }}>Clear</Button>
                        <Button className={"col-sm-4 col-md-2 col-lg-1"} variant="primary" type="submit">Search</Button>
                    </Row>
                </Form>
            </Row>

            {alertType === 'danger' && <Alert key={alertMsg} variant={alertType} id="alertMsg">{alertMsg}</Alert>}
                        
            {!isCreating &&
                <Row id="item-options">
                    <Button className="col-sm-4 col-md-2" onClick={() => setIsCreating(true)}>
                        {"Create Certificates"}
                    </Button>
                </Row>
            }
            
            {isCreating && <CertificateCreator onCreation={generateGiftCertificates} onCancel={setIsCreating} />}
            <Footer />
        </Container>
    )
}

export default CertificatesPage;
