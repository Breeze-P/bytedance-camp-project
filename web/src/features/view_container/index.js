import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import 'antd/dist/antd.css';
import './style.css';
import {Button, Layout, PageHeader} from 'antd';
import ProjectList from "../project_list";
import AddProjectForm from "./compontents/add_project_form";
import Page from "../page/index"
import {
    PlusCircleOutlined,
    ClockCircleOutlined,
    RedoOutlined
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const ViewContainer = () => {
    const [ projects, setProjects ] = useState([]);
    const [ timeFlag, setTimeFlag ] = useState(false);
    const [ alertFlag, setAlertFlag ] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3000/api/base").then(
            res => {
                return res.json();
            }
        ).then(
            data => {
                setProjects(data.data);
            }
        ).catch((e) => {
            console.log(e);
        });
    }, []);

    const sortTimeByTime = () => {
        let tempProjects = projects;
        if (!timeFlag) {
            tempProjects = tempProjects.sort((a, b) => {
                const aTime = new Date(a.createdAt);
                const bTime = new Date(b.createdAt);
                return aTime.getTime() - bTime.getTime();
            });
            setProjects(tempProjects);
            setTimeFlag(true);
        } else {
            tempProjects = tempProjects.sort((a, b) => Number(a.id) - Number(b.id));
            setProjects(tempProjects);
            setTimeFlag(false);
        }
    }

    const addProjectForm = () => {
        if(!alertFlag) {
            setAlertFlag(true);
        } else {
            setAlertFlag(false);
        }
    }

    return(
        <Switch>
            <Route exact path="/project">
                <div className="project-wrap">
                    {(!alertFlag) ? null:
                        <div className="cover-black" />
                    }
                    <Layout style={{ minHeight: '100vh' }}>
                        <Layout className="site-layout">
                            <Header className="site-layout-background" style={{ padding: 0 }}>
                                <button className="header-left" onClick={sortTimeByTime}>
                                    {(!timeFlag) ?
                                        <span>
                                <ClockCircleOutlined />
                                时间排序
                            </span>
                                        :
                                        <span>
                                <RedoOutlined />
                                序号排序
                            </span>
                                    }
                                </button>
                                <div className="header-title">
                                    项目列表
                                </div>
                                <button className="header-right" onClick={addProjectForm}>
                        <span>
                            <PlusCircleOutlined />
                            添加项目
                        </span>
                                </button>
                            </Header>
                            {(!alertFlag) ? null:
                                <AddProjectForm onSubmit={addProjectForm}/>
                            }
                            <Content className="site-layout-background content-container">
                                <ProjectList projects={projects} />
                            </Content>
                            <Footer style={{ textAlign: 'center' }}>Author: Breeze-P | Github:
                                <a href="https://github.com/Breeze-P" style={{ whiteSpace: "pre" }}>  https://github.com/Breeze-P</a>
                            </Footer>
                        </Layout>
                    </Layout>
                </div>
            </Route>
            <Route exact path="/page/:id">
                <Page />
            </Route>
            <Redirect from="/*" to="/project"/>
        </Switch>
    )
}

export default ViewContainer;