import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import TopBar from '../../components/TopBar';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import AgencyCreator from './AgencyCreator';
import Agency from './Agency';
import Container from 'react-bootstrap/Container';
import { agency, certificate } from '../../interfaces';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import React from 'react';
import { Footer } from '../../components/Footer';

function AgenciesPage() {
    const [agencies, setAgencies] = useState<agency[]>([]); // Initialize state with an empty array
    const [displayedAgencies, setDisplayedAgencies] = useState<agency[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [isEditing, setIsEditing] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMsg, setAlertMsg] = useState('');

    const [searchName, setSearchName] = useState('');
    const [searchActive, setSearchActive] = useState(true);
    const [searchPageSize, setSearchPageSize] = useState(pageSize);
    

    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                const token = localStorage.getItem('token')
                // Perform your asynchronous data fetching here
                const response = await fetch('https://thf-node-server-s64bwmcpia-uk.a.run.app/agencies', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jwtToken: localStorage.getItem('token')
                    })
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch agencies');
                }
                const data = await response.json();
                setAgencies(data.data);
                setDisplayedAgencies(data.data);
            } catch (error: any) {
                console.error('Error fetching agencies:', error);
            }
        };

        fetchAgencies(); // Call the fetch function when the component mounts
    }, []);

    // format: [column name, column width]
    const columnInfo: [string, number][] = [["Name", 3], ["Active", 1], ["Phone", 2], ["Email", 2], ["Actions", 6]]

    const setAlert = (editing: boolean, alertType: string, alertMsg: string) => {
        setIsEditing(editing);
        setAlertType(alertType);
        setAlertMsg(alertMsg);
        if (alertType === 'success') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setTimeout(() => {
            setAlertType('');
            setAlertMsg('');
        }, 5000);
    };
    

    // Curries the function to archive a specific agency while checking types
    const archiveAgency = (id: string) => { 
        return async () => {
            try {
                const response = await fetch(`https://thf-node-server-s64bwmcpia-uk.a.run.app/agencies/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ archive: true, active: false })
                });
                const data = await response.json();
                if (response.ok) {
                    setAlert(false, 'success', data.message);
                } else {
                    setAlert(false, 'danger', data.message);
                }
            } catch (error: any) {
                setAlert(false, 'danger', error.message);
            }
        }
    }

    // changes the page number upon clicking the pagination buttons
    const changePage = (newPage: number) => {
        setPage(newPage);
    }

    const goToFilter = () => {
        const range = document.createRange();
        range.selectNode(document.getElementById('search-filter') as Node);
        range.getBoundingClientRect();
        const y = range.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }

    const searchAgencies = () => {
        const filteredAgencies = agencies.filter((a) =>
            (!searchName || a.name.includes(searchName)) &&
            (!searchActive || a.active === searchActive)
        );
        setPage(0);
        setPageSize(searchPageSize);
        setDisplayedAgencies(filteredAgencies);
        setAlertType('success');
        setAlertMsg('Search successful');
        // scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            setAlertType('');
            setAlertMsg('');
        }, 5000);
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileData = await file.text();
            const newAgencies = parseCSV(fileData)
                .map(a => {
                    return {
                        id: '',
                        name: a['Business Name'],
                        addressLine1: a['Address Line 1'],
                        addressLine2: a['Address Line 2'],
                        city: a['City'],
                        state: a['State'],
                        zip: a['Zip'],
                        phone: a['Phone'],
                        email: a['Email'],
                        active: true
                    }
                })
                //filter out only unique agencies
                .filter((a, i, self) => self.findIndex((t) => t.name === a.name) === i);
            const failedAgencies: string[] = []
            newAgencies.forEach(async (a: agency) => {
                const currentAgency = agencies.find((existing) => existing.name === a.name);
                if (!currentAgency) {
                    try {
                        const response = await fetch('https://thf-node-server-s64bwmcpia-uk.a.run.app/agencies', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(a)
                        });
                        if (!response.ok) {
                            failedAgencies.push(a.name);
                        }
                    } catch (error: any) {
                        setAlertType('danger');
                        setAlertMsg('Error creating agency: ' + error.message);
                    }
                } else {
                    try {
                        const response = await fetch(`https://thf-node-server-s64bwmcpia-uk.a.run.app/agencies/${currentAgency.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(a)
                        });
                        if (!response.ok) {
                            failedAgencies.push(a.name);
                        }
                    
                    } catch (error: any) {
                        setAlertType('danger');
                        setAlertMsg('Error updating agency: ' + error.message);
                    }
                }
            });
            if (failedAgencies.length > 0) {
                setAlertType('danger');
                setAlertMsg(`Error creating/updating the following agencies: ${failedAgencies.join(', ')}`);
            } else {
                setAlertType('success');
                setAlertMsg('Agencies updated successfully via excel form inputs');
            }
        }
    };

    const handleUploadButtonClick = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv';
        fileInput.style.display = 'none';
        // Creates a one-time event handler that removes the element after it times out in 0.5s
        const handler = () => {
            setTimeout(() => {
                if (fileInput.files) {
                    handleFileUpload({ target: { files: fileInput.files } } as React.ChangeEvent<HTMLInputElement>);
                }
                fileInput.remove();
            }, 500);
        }

        fileInput.addEventListener('change', handler);

        fileInput.click();
        
    };

    const parseCSV = (csv: string): any[] => {
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const row: { [x:string]: any } = {};

            for (let j = 0; j < headers.length; j++) {
                row[headers[j]] = values[j];
            }

            data.push(row);
        }

        return data;
    };

    const downloadAgencies = async () => {
            try {
                const token = localStorage.getItem('token')
                let csvContent = ["Business Name,Address Line 1,Address Line 2,City,State,Zip,Phone,Email,Expense Date,Expense Amount,Expense Description"];
                const response = await fetch('https://thf-node-server-s64bwmcpia-uk.a.run.app/gift_certificates', {
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jwtToken: token
                    })
                })
                if (!response.ok) {
                    setAlertType('danger');
                    setAlertMsg('Error downloading agencies');
                    return;
                }
                const allCertificates = (await response.json()).data
                    .filter((c: certificate) => c.dateRedeemed)
                    .map((c: certificate) => {
                        return {
                            agency: c.agency.name,
                            dateRedeemed: c.dateRedeemed,
                            amount: c.amount * c.percentageRedeemed / 100,
                            description: c.description
                        }
                    });
                agencies.forEach((a) => {
                    const line = `${a.name},${a.addressLine1},${a.addressLine2},${a.city},${a.state},${a.zip},${a.phone},${a.email},`;
                    allCertificates.forEach((c: any) => {
                        if (c.agency === a.name){
                            csvContent.push(line + `${c.dateRedeemed},${c.amount},${c.description}`);
                        }
                    })
                });
                const csv = csvContent.join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                const dateString = new Date().toISOString().split('T')[0];
                a.href = url;
                a.download = `agencies_for_CharityProud_${dateString}.csv`;
                a.click();
                setAlertType('success');
                setAlertMsg("Agency information downloaded successfully");
            } catch (error: any) {
                setAlertType('danger');
                setAlertMsg('Error downloading agencies: ' + error.message);
            }
    }
    
    // set the tab title
    document.title = 'Agencies';

    return (
        <Container>
            <TopBar /> { /* TODO: replace with actual user when authentication is incorporated */}
            {alertType === 'success' && <Alert key={alertMsg} variant={alertType}>{alertMsg}</Alert>}
            <Row>
                <h2>{"Agencies"}</h2>
                <Button className="col-sm-4 col-md-2 mb-3" id="start-filter" onClick={goToFilter}>
                    Find Agencies
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
                        {displayedAgencies.slice(page * pageSize, (page + 1) * pageSize)
                            .map((o) => (Agency({ renderObject: o, callback: archiveAgency })))}
                    </tbody>
                </Table>
                <div className="pagination">
                    <Button variant="outline-primary"
                        onClick={() => changePage(page - 1)} disabled={page === 0}>
                        {"<< Prev"}
                    </Button>
                    <span className="page-num">{`${page + 1} / ${Math.ceil(displayedAgencies.length / pageSize)}`}</span>
                    <Button variant="outline-primary"
                        onClick={() => changePage(page + 1)} disabled={(page + 1) * pageSize >= displayedAgencies.length}>
                        {"Next >>"}
                    </Button>
                </div>
            </Row>

            <Row id="search-filter">
                <h2>Search and Filters</h2>
                <Form className="search-filters" onSubmit={(e) => {
                    e.preventDefault();
                    searchAgencies()
                }}>
                    <Row>
                        <Form.Group as={Col} controlId="search-by-agency-name">
                            <Form.Label>AgencyName:</Form.Label>
                            <Form.Control value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="display-per-page">
                            <Form.Label>Number of Agencies Per Page:</Form.Label>
                            <Form.Control type="number"
                                value={searchPageSize}
                                min={1}
                                onChange={(e) => setSearchPageSize(parseInt(e.target.value || "1"))}
                            />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col} controlId="show-only-active">
                            <Form.Label>Show Only Active Agencies:</Form.Label>
                            <Form.Check type="checkbox"
                                value={searchActive.toString()}
                                onChange={() => {
                                    setSearchActive(!searchActive);
                                }} />
                        </Form.Group>
                    </Row>   
                    <Row className="search-options">
                        <Button variant="secondary" className={"col-1"} onClick={() => {
                            setSearchActive(false);
                            setSearchName('');
                            setSearchPageSize(pageSize);
                        }}>Clear</Button>
                        <Button className={"col-1"} variant="primary" type="submit">Search</Button>
                    </Row>
                </Form>
            </Row>

            {alertType === 'danger' && <Alert key={alertMsg} variant={alertType}>{alertMsg}</Alert>}
            {!isEditing &&
                <Row id="item-options">
                    <Button className="col-sm-4 col-md-2" variant="outline-primary" onClick={() => setIsEditing(true)}>Create Agency</Button>
                    <Button className="col-sm-4 col-md-2" variant="outline-primary" onClick={handleUploadButtonClick}>Upload Agency Info</Button>
                    <Button className="col-sm-4 col-md-2" variant="outline-primary" onClick={downloadAgencies}>Download Agency Info</Button>
                </Row>
            }
            {isEditing && <AgencyCreator 
                onCreation={setAlert} 
                onClose={setIsEditing}
                nameList={agencies.map((a) => a.name)}
                />}
            <Footer />
        </Container>
    )
}

export default AgenciesPage;
