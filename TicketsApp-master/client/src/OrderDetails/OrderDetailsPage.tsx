import React, {Component, ReactElement} from 'react';
import {OrderModel} from "@pavo/shared-services-shared/src";
import axiosInstance from "../Auth/AxiosInstance";
import {Avatar, Breadcrumb, Button, Carousel, Descriptions, List, notification, Progress, Result} from "antd";
import {userService} from "../Services/UserService";
import { HomeOutlined } from '@ant-design/icons';
import {Link} from "react-router-dom";
import {api_url} from "../environment";

class OrderDetailsPage extends Component<any, {order: OrderModel, createdSuccessfully: boolean}> {
    constructor(props: unknown) {
        super(props);
        this.state = {
            order: null,
            createdSuccessfully: false,
        };
      }

      async componentDidMount() {
        await this.refreshOrder();
      }

      refreshOrder(): void {
        const { match: { params } } = this.props;
        axiosInstance.get(`/orders/getOrder/${params.id}`).then((response) => {
          this.setState({
            order: response.data,
          });
        });
      }

      participate(): void {
        axiosInstance.put("/orders/addParticipant", {
          orderId : this.state.order._id,
        }).then(() => {
          this.successNotification('You have successfully participated!');
          this.refreshOrder();
        }, (e: unknown) => this.errorNotification(e));
      }

    submit(): void {
        axiosInstance.put("/orders/submit", {
            orderId : this.state.order._id,
        }).then(() => {
            this.setState({
                createdSuccessfully: true,
            });
            // this.successNotification('You have successfully submitted the order!');
            // this.refreshOrder();
        }, (e: unknown) => this.errorNotification(e));
    }

      leave(): void {
        axiosInstance.put("/orders/removeParticipant", {
          orderId : this.state.order._id,
        }).then(() => {
          this.successNotification('You have left!');
          this.refreshOrder();
        }, (e: unknown) => this.errorNotification(e));
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
          const {order, createdSuccessfully} = this.state;
          if(!order) return <p>Loading ...</p>;
          if (createdSuccessfully) {
              return (
                  <Result
                      status="success"
                      title={"Successfully Submitted Order " + order.product.title + " !"}
                      subTitle={"Order number: " + order._id + " all participants will be notified."}
                      extra={[
                          <Button type="primary" key="console">
                              <Link to={`/`}>
                                  <span> Go Back</span>
                              </Link>
                          </Button>
                      ]}
                  />
              );
          }
          return (
              <><Breadcrumb style={{paddingBottom: "10px"}}>
                <Breadcrumb.Item>
                    <Link to='/'>
                        <HomeOutlined/>
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{order.product.title}</Breadcrumb.Item>
              </Breadcrumb>
                  {order.product?.fileName &&
                      <Carousel>
                          <div>
                              <img
                                  style={{maxWidth: "100%", maxHeight: "100%"}}
                                  alt=""
                                  src={`${api_url}/static/${order.product?.fileName}`}
                              />
                          </div>
                      </Carousel>
                  }
                  <div>
                      <Progress type="circle"
                                percent={((order.participants?.length || 0) / order.product.participantsAmount) * 100}
                                style={{position: "relative", float: "right"}}
                      />
                      <Descriptions
                      style={{maxWidth: "50vw"}}
                      contentStyle={{border: "1px solid #d3d3d3"}}
                      labelStyle={{border: "1px solid #d3d3d3"}}
                      bordered
                      title={order.product.title}
                      size={"default"}
                      column={1}
                      extra={
                          userService.getCredentials() && (!order.isSubmitted && [!order.participants.find((p) => p._id === userService.getCredentials()?._id)
                          ? <Button key={1} type="primary" id={"participateButton"} onClick={() => {
                            this.participate();
                          }}>Participate</Button>
                          : <Button key={2} type="primary" danger id={"leaveButton"} onClick={() => {
                            this.leave();
                          }}>Leave</Button>,
                          (userService.hasRole("Admin") && order.participants.length === order.product.participantsAmount) &&
                              <Button key={3}
                                      type="primary"
                                      id={"submitButton"}
                                      style={{marginLeft: "10px"}}
                                      onClick={() => {
                                  this.submit();
                              }}>Submit</Button>,
                              (order.participants.length === order.product.participantsAmount) &&
                              <Button style={{marginLeft: "10px"}} key={4} type="primary" danger id={"feedbackButton"}>
                                  <Link to={`/newFeedback/${order._id}`}>
                                      Feedback
                                  </Link>
                              </Button>
                      ])}
                  ><Descriptions.Item label="Company"><Link to={`/company/${order.product.company._id}`}>{order.product.company.title}</Link></Descriptions.Item>
                    <Descriptions.Item label="Description">{order.product.description}</Descriptions.Item>
                    <Descriptions.Item label="Price">{order.product.price}</Descriptions.Item>
                    <Descriptions.Item
                        label="Required number of participants">{order.product.participantsAmount}</Descriptions.Item>
                    <Descriptions.Item label="Participants">{order.participants?.map((participant) => (
                        <p className={"order-details__participant"} key={participant._id}>{participant.firstName + " " + participant.lastName}</p>
                    ))}</Descriptions.Item>
                  </Descriptions>
                      <Descriptions title={"Feedbacks:"} style={{paddingTop: "30px"}}></Descriptions>
                      <List
                          itemLayout="horizontal"
                          dataSource={order.product.feedbacks}
                          renderItem={item => (
                              <List.Item>
                                  <List.Item.Meta
                                      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                      title={item.authorId.firstName}
                                      description={item.description}
                                  />
                              </List.Item>
                          )}
                      />
              </div></>

          )
      }

}

export default OrderDetailsPage;
