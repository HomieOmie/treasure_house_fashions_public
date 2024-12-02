// This page is where the users apply filters to the data they want to see in the reports.
import React, { useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Row } from "react-bootstrap";
import AsyncSelect from 'react-select';
import TopBar from '../../components/TopBar';
import TextInput from '../../components/TextInput';
import { agency } from '../../interfaces';
import { Footer } from '../../components/Footer';

// Two kinds of reports: displaying all relevant gift certificates && grouping by agencies
export default function ReportPage() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [agencies, setAgencies] = useState<{label: string, value: string}[]>([]);
    const [selectedAgencies, setSelectedAgencies] = useState<{label: string, value: string}[]>([]);
    const [alertType, setAlertType] = useState('');
    const [alertMsg, setAlertMsg] = useState('');
    const [reportType, setReportType] = useState('by-agency');

    useEffect(() => {
        const fetchAgencies = async () => {
            const response = await fetch('https://thf-node-server-s64bwmcpia-uk.a.run.app/agencies',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ jwtToken: localStorage.getItem('token') })
                }
            )
            const data = (await response.json()).data
            data.sort((a: agency, b: agency) => a.name.localeCompare(b.name));
            setAgencies(data.map((agency: any) => ({value: agency.id, label: agency.name})));
        }

        fetchAgencies();
    }, []);

    const handleGenerateReport = async () => {
        await fetch(`https://thf-node-server-s64bwmcpia-uk.a.run.app/report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jwtToken: localStorage.getItem('token'),
                agencies: selectedAgencies.map((agency) => agency.value),
                startDate,
                endDate,
                reportType
            })
        }).then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                setAlertType('danger');
                
            } else {
                downloadReport(data.report);
                setAlertType('success');
            }
            setAlertMsg(data.message);
        });
    }

    const downloadReport = (csvStr: string) => {
        const blob = new Blob([csvStr], {type: 'text/csv'});
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');

        const clickHandler = () => {
            setTimeout(() => {
              URL.revokeObjectURL(url);
              a.removeEventListener('click', clickHandler);
            }, 150);
        };
        
        a.addEventListener('click', clickHandler, false);

        a.href = url;
        a.download = 'report.csv';
        a.click();
    }
    
    const getOptionLabel = (agencies: {label: string, value: string}) => {
        return agencies.label;
    }

    const getOptionValue = (agencies: {label: string, value: string}) => {
        return agencies.value;
    }

    // set the tab title
    document.title = 'Get Report';

    return (
        <Container>
            <TopBar />
            
            { alertType && <Alert variant={alertType}>{alertMsg}</Alert>}
            <Row>
                <h2>Get Reports</h2>
                <Form>
                    <Form.Group>
                        <Form.Label htmlFor="report-agencies">For Agencies: </Form.Label>
                        <AsyncSelect
                            id="report-agencies"
                            name="agencies"
                            isMulti
                            defaultValue={[]}
                            value={selectedAgencies}
                            getOptionLabel={getOptionLabel}
                            getOptionValue={getOptionValue}
                            onChange={(v) => setSelectedAgencies(v as {label: string, value: string}[])}
                            options={agencies}
                            placeholder="Default: all agencies"
                            className={"mb-3"}
                        />
                    </Form.Group>

                    <TextInput label="Start Date: (Format: YYYY-MM-DD) " id="report-start-date" value={startDate} setValue={setStartDate} />
                    <TextInput label="End Date: (Format: YYYY-MM-DD) " id="report-end-date" value={endDate} setValue={setEndDate} />
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="report-type">Sort By: </Form.Label>
                        <Form.Select value={reportType} onChange={(e) => setReportType(e.target.value)} 
                            aria-label="select-report-type" id="report-type">
                            <option value="by-agency">By Agency</option>
                            <option value="by-certificate">By Certificate</option>
                        </Form.Select>
                    </Form.Group>
                    <Button onClick={handleGenerateReport}>Generate Report</Button>
                </Form>
            </Row>
            <Footer />
        </Container>
    );
}