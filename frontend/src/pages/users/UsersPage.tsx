import React, { useEffect, useState } from 'react';
import { Navigate, useLoaderData } from 'react-router-dom';
import PaginatedList from '../../components/PaginatedList';
import TopBar from '../../components/TopBar';
import User from './User';
import UserCreator from './UserCreator';
import Container from 'react-bootstrap/Container';
import { user, UserAddParams } from '../../interfaces';
import { Footer } from '../../components/Footer';
import { Button, Row, Table } from 'react-bootstrap';

//TODO: Update authentication to only allow Admins to view all users
function UsersPage() {

    const [users, setUsers] = useState<user[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [isEditing, setIsEditing] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMsg, setAlertMsg] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await fetch('https://thf-node-server-s64bwmcpia-uk.a.run.app/getAllUsers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ jwtToken: token })
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // changes the page number upon clicking the pagination buttons
    const changePage = (newPage: number) => {
        setPage(newPage);
    }

    // format: [column name, column width]
    const columnInfo: [string, number][] = [["First Name", 2], ["Last Name", 2], ["Email", 1], ["Phone", 1], ["Role", 3], ["Active", 3], ["", 1]]

    // TODO: Connect to the backend to create user. Connect UserCreator component?
    const createUser = async (params: UserAddParams) => {
        fetch('https://thf-node-server-s64bwmcpia-uk.a.run.app/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        })
        .then((response: Response) => {})
        .catch((error) => {
            // TODO: Handle error with actual error messages
            console.error('Error:', error);
        });
    }

    const onDelete = (id: string) => {

    }

    // set the tab title
    document.title = 'Users';

    return (
        <Container>
            <TopBar /> { /* TODO: replace with actual user when authentication is incorporated */ }
            <Row>
                <h2>{"Users"}</h2>
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
                        {users.slice(page * pageSize, (page + 1) * pageSize)
                            .map((o) => (User({ renderObject: o})))}
                    </tbody>
                </Table>
                <div className="pagination">
                    <Button variant="outline-primary"
                        onClick={() => changePage(page - 1)} disabled={page === 0}>
                        {"<< Prev"}
                    </Button>
                    <span className="page-num">{`${page + 1} / ${Math.ceil(users.length / pageSize)}`}</span>
                    <Button variant="outline-primary"
                        onClick={() => changePage(page + 1)} disabled={(page + 1) * pageSize >= users.length}>
                        {"Next >>"}
                    </Button>
                </div>
                <UserCreator />
            </Row>
        </Container>
    )
}

export default UsersPage;
