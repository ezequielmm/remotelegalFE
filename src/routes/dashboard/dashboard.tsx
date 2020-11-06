import React from "react";
import { useHistory, Link } from "react-router-dom";
import Button from "../../components/Button";
import Layout from "../../components/Layout";

const Dashboard = () => {
    const history = useHistory();
    return (
        <Layout>
            <p>IMAGE</p>
            <p>Welcome to Remote Legal</p>
            <p>Want to schedule a deposition? Click the button below</p>
            <Button onClick={() => history.push("/deposition")}>Schedule deposition</Button>
            <div>
                <Link to="/videochat">Videochat</Link>
            </div>
        </Layout>
    );
};
export default Dashboard;
