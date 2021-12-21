import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {userService} from "../Services/UserService";
import {CompanyModel, CompanyState} from "@pavo/shared-services-shared/src";
import axiosInstance from "../Auth/AxiosInstance";
import {Button, Card, Col, notification, Row} from "antd";
import {api_url} from "../environment";

class CompaniesListPage extends Component<any, CompanyState> {
    constructor(props: unknown) {
        super(props);

        this.state = {
            companies: null,
            credentials: null,
        };
        this.createOrder = this.createOrder.bind(this);
    }

    async componentDidMount() {
        const companies: CompanyModel[] = (await axiosInstance.get(`/companies/allCompanies`)).data;
        this.setState({
            companies,
            credentials: userService.getCredentials(),
        });
    }

    createOrder(id: string) {
        axiosInstance.post(`/companies/addCompany`, {
            product: id,
        }).then((_order) => {
            this.successNotification();
            // this.props.history.push('/');
        }, (error: unknown) => {
            console.log(error)
        });
    }

    successNotification() {
        notification["success"]({
            message: 'Company has been successfully created!',
        });
    };

    render() {
        return (
            <div className="companies-page-cards-container">
                { userService.isAuthenticated() && (userService.hasRole('User') || userService.hasRole('Admin')) &&
                    <div style={{paddingBottom: "15px"}}>
                        <Button type={"primary"}
                                id={"newCompanyButton"}>
                            <Link to='/newCompany'>
                                New Company
                            </Link>
                        </Button>
                    </div>
                }
                <Row gutter={16}>
                    {this.state.companies === null && <p>Loading companies... </p>}
                    {
                        this.state.companies?.map(company => (
                            <Col span={4}
                                 style={{paddingBottom: "10px"}}
                                 key={company._id}
                            >
                                <Card
                                    title={company.title}
                                    style={{ width: 300, height: 200 }}
                                    cover={
                                        company.fileName &&
                                        <img
                                            style={{maxWidth: "100%", maxHeight: "100%", padding: "10px"}}
                                            alt=""
                                            src={`${api_url}/static/${company.fileName}`}
                                        />
                                    }
                                >
                                    <p>{company.title}</p>
                                    <b>Description: {company.description}</b>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
            </div>
        )
    }
}

export default withRouter(CompaniesListPage);
