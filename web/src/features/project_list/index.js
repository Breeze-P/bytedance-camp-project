import React from 'react';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Row, Col, Card } from 'antd';
import './style.css'

const { Meta } = Card;

const ProjectList = (props) => {
    const { projects } = props;

    const rowNumber = (!projects) ? 0 : (Math.ceil( projects.length / 4));

    const projectsCols = (!projects) ? null : projects.map((item, index) =>
        <Col className="gutter-row" span={6} key={index} >
            <Link to={`/page/${item.id}`} className="card-out">
                <Card className="project-card" bordered={false} title={item.name}
                      cover={<img className="card-icon" alt="项目图片" src="test.png" />}>
                    <Meta title={item.desc} description={new Date(item.createdAt).toLocaleDateString()} />
                </Card>
            </Link>
        </Col>
    );

    const content =
        <Row gutter={[8 * rowNumber, 24]} >
            {projectsCols}
        </Row>

    return(
        <div className="project-list-container">
            {content}
        </div>
    )
}

export default ProjectList;