import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Table, Row } from "react-bootstrap";

interface PaginatedListParams {
    title: string,
    objects: unknown[],
    columnInfo: [string, number][],
    component: Function,
    objectMethod: Function
}

function PaginatedList(params: PaginatedListParams) {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    console.log(page)

    const pageLen = Math.ceil(params.objects.length / pageSize);

    const [paginatedObjects, setPaginatedObjects] = useState(params.objects.slice(page * pageSize, page * pageSize + 1));

    // TODO: use react-bootstrap to style the tables!
    return (
        <Row>
            <h2>{params.title}</h2>
            <Table responsive>
                <thead>
                    {/* colSpan must be at least 1 and varies according to how 
                        many columns the item will take */}
                    {params.columnInfo.map(([name, width]) =>
                        <th key={name}
                            className={`list-title col-${width}`}
                            colSpan={Math.max(Math.floor(width / 2), 1)}>
                            {name}
                        </th>)}
                </thead>
                <tbody>
                    {paginatedObjects.map((o) => (params.component({ renderObject: o, callback: params.objectMethod })))}
                </tbody>

            </Table>
            {/* Uses outline yet will define custom css for button color */}
            <div className="pagination">
                <Button variant="outline-primary"
                    onClick={() => {
                        const newPage = page - 1;
                        setPage(newPage)
                        setPaginatedObjects(params.objects.slice(newPage * pageSize, (newPage + 1) * pageSize))
                    }} disabled={page === 0}>
                    {"<< Prev"}
                </Button>
                <span className="page-num">{`${page + 1} / ${pageLen}`}</span>
                <Button variant="outline-primary"
                    onClick={() => {
                        const newPage = page + 1;
                        setPage(newPage)
                        setPaginatedObjects(params.objects.slice(newPage * pageSize, (newPage + 1) * pageSize))
                    }} disabled={(page + 1) * pageSize >= params.objects.length}>
                    {"Next >>"}
                </Button>
                {/* TODO: if there is no scope creep, add button or select here that allows 
                    for changing numbers of objects for displaying */}
            </div>
        </Row>

    );
}

PaginatedList.propTypes = {
    title: PropTypes.string.isRequired,
    objects: PropTypes.array.isRequired,
    columnInfo: PropTypes.array.isRequired,
    component: PropTypes.func.isRequired,
    objectMethod: PropTypes.func.isRequired,
};

export default PaginatedList;
