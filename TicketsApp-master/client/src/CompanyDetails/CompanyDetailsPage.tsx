import React, {Component, ReactElement} from 'react';
import {CompanyModel} from "@pavo/shared-services-shared/src";
import axiosInstance from "../Auth/AxiosInstance";
import {Card, notification} from "antd";
import {api_url} from "../environment";

class CompanyDetailsPage extends Component<any, {company: CompanyModel}> {
    constructor(props: unknown) {
        super(props);
        this.state = {
          company: null
        };
      }

      async componentDidMount() {
        await this.refreshCompany();
      }

      refreshCompany(): void {
        const { match: { params } } = this.props;
        axiosInstance.get(`/companies/getCompany/${params.id}`).then((response) => {
          this.setState({
            company: response.data,
          });
        });
      }

      successNotification(message: string): void {
        notification["success"]({
          message,
        });
      };

      errorNotification(e: unknown) {
        notification["error"]({
          message: (e as {response: any}).response.data,
        });
      };

      render(): ReactElement {
          if(!this.state.company) return <p>Loading ...</p>;
          return (
              <div>
                  <Card
                      title={this.state.company.title}
                      style={{ width: 300, height: 200 }}
                      cover={
                          this.state.company.fileName &&
                          <img
                              style={{maxWidth: "100%", maxHeight: "100%", padding: "10px"}}
                              alt=""
                              src={`${api_url}/static/${this.state.company.fileName}`}
                          />
                      }
                  >
                      <p>{this.state.company.title}</p>
                      <b>{this.state.company.description}</b>
                  </Card>
              </div>
          )
      }

}

export default CompanyDetailsPage;
