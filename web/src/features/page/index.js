import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import {Stage, Layer, Rect, Circle, Line, Star, Transformer} from 'react-konva';
import { Layout, Menu, Divider, Input, Row, Col, Button, Popover } from "antd";
import {
    AppstoreOutlined,
    BgColorsOutlined,
    LogoutOutlined,
    RollbackOutlined,
    SmileOutlined,
    TableOutlined
} from '@ant-design/icons';
import { ChromePicker } from 'react-color'
import 'antd/dist/antd.css';
import './style.css';
import {Link} from "react-router-dom";

const { Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;

const shapeList = ['Rect', 'Circle', 'Triangle', 'Star'];

const ShapeItem = ({ shapeProps, isSelected, onSelect, onChange }) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    const components = {
        'Rect': Rect,
        'Circle': Circle,
        'Triangle': Line,
        'Star': Star
    };

    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    const ShapeItem = components[shapeList[shapeProps.typeIndex]];

    return (
        <React.Fragment>
            <ShapeItem
                onClick={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                draggable={isSelected}
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
                onTransformEnd={() => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = shapeRef.current;

                    // we will reset it back
                    // node.scaleX(1);
                    // node.scaleY(1);

                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        // set minimal value
                        width: node.height(),
                        height: node.height(),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

const initialShapes = [
    {
        id: '0',
        typeIndex: 0,
        x: 600,
        y: 100,
        width: 100,
        height: 100,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 0,
        shadowColor: 'black',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowOpacity: 0.5
    },
    {
        id: '1',
        typeIndex: 1,
        x: 450,
        y: 250,
        fill: 'black',
        stroke: 'black',
        strokeWidth: 0,
        shadowColor: 'black',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowOpacity: 0.5,

        radius: 70,
    },
    {
        id: '2',
        typeIndex: 2,
        x: 300,
        y: 300,
        fill: '#00D2FF',
        stroke: 'black',
        strokeWidth: 0,
        shadowColor: 'black',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowOpacity: 0.5,

        points: [0, 0, 40, 40, -40, 40],
        closed: true,
    },
    {
        id: '3',
        typeIndex: 3,
        x: 510,
        y: 150,
        width: 100,
        height: 100,
        fill: 'yellow',
        stroke: 'black',
        strokeWidth: 1,
        shadowColor: 'black',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowOpacity: 0.5,

        numPoints: 5,
        innerRadius: 36,
        outerRadius: 108,
    },
];

const Page = () => {
    const [shapes, setShapes] = useState(initialShapes);
    const [selectedId, selectShape] = useState(null);
    const [current, setCurrent] = useState(null);
    const [siderCurrent, setSiderCurrent] = useState(null);
    const [outPut, setOutPut] = useState(false);
    let { id } = useParams();

    const strShapes = JSON.stringify(shapes);

    const curShape = shapes[Number(selectedId)];

    const savePage = () => {
        const data = {
            id: id,
            page: shapes
        }

        fetch('https://qc9rmq.fn.thelarkcloud.com/insertPage', {method: 'POST', headers: {'Content-type': 'application/json'}, body: JSON.stringify(data)}).then( res => {
            if (res.status === 200) {
                console.log('????????????')
            }
        } ).catch(e => {
            console.log(e)
        });
    }

    const handleShapeChange = (newAttrs) => {
        if (selectedId) {
            const shapeItem = shapes.slice();
            shapeItem[Number(selectedId)] = newAttrs;
            setShapes(shapeItem);
        }
    }

    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
            setSiderCurrent(null);
        }
    };

    const handleMenuClicked = e => {
        const key = e.key;
        let arg = {
            id: `${shapes.length}`,
            x: 300,
            y: 300,
            width: 100,
            height: 100,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            shadowColor: 'black',
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowOpacity: 0.5
        };
        switch (key) {
            case 'rect':
                setShapes([...shapes, {...arg, typeIndex: 0}]);
                break;
            case 'circle':
                setShapes([...shapes, {...arg, typeIndex: 1, radius: 70,}]);
                break;
            case 'triangle':
                setShapes([...shapes, {...arg, typeIndex: 2,points: [0, 0, 40, 40, -40, 40],
                    closed: true,}]);
                break;
            case 'star':
                setShapes([...shapes, {...arg, typeIndex: 3,numPoints: 5,
                    innerRadius: 36,
                    outerRadius: 108,}]);
                break;
            case 'output':
                setOutPut(!outPut);
                break;
            default:
                break;
        }
        setCurrent(null);
    };

    const handleSiderClicked = e => {
        setSiderCurrent(e.key);
        selectShape(e.key);
    };

    const handleColorChange = (color) => {
        handleShapeChange({
            ...shapes[Number(selectedId)],
            fill: color.hex
        })
    }

    const handleInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value
        switch (name) {
            case 'x':
                handleShapeChange({...curShape, x: value});
                break;
            case 'y':
                handleShapeChange({...curShape, y: value});
                break;
            case 'width':
                handleShapeChange({...curShape, width: value});
                break;
            case 'height':
                handleShapeChange({...curShape, height: value});
                break;
            case 'strokeWidth':
                handleShapeChange({...curShape, strokeWidth: value});
                break;
            case 'shadowOffset-x':
                handleShapeChange({...curShape, shadowOffsetX: value});
                break;
            case 'shadowOffset-y':
                handleShapeChange({...curShape, shadowOffsetY: value});
                break;
            case 'shadowOpacity':
                handleShapeChange({...curShape, shadowOpacity: value});
                break;
            default:
                break;
        }
    }

    const handleCancel = () => {
        setOutPut(false);
    }

    const handleStrokeColor = (color) => {
        handleShapeChange({
            ...shapes[Number(selectedId)],
            stroke: color.hex
        })
    }
    const handleShadowColor = (color) => {
        handleShapeChange({
            ...shapes[Number(selectedId)],
            shadowColor: color.hex
        })
    }

    const siderRight = (selectedId) ?
        <div className="sider-sider">
            <div className="shape-info normal" >
                ??????
                <Row gutter={[16, 8]}>
                    <Col className="gutter-row" span={12}>
                        <Input name={'x'} size="small" suffix={'X'} value={curShape.x} onChange={handleInputChange}/>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Input name={'y'} size="small" suffix={'Y'} value={curShape.y} onChange={handleInputChange} />
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Input name={'width'} size="small" suffix={'W'} value={curShape.width} onChange={handleInputChange} />
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Input name={'height'} size="small" suffix={'H'} value={curShape.height} onChange={handleInputChange} />
                    </Col>
                </Row>
            </div>
            <Divider style={{ width: 120 , margin: 10 }}/>
            <div className="shape-info color" >
                ?????????
                <div className="color-wrap">
                    <Popover placement="bottomLeft" title="Color Picker"
                             content={<ChromePicker color={shapes[Number(selectedId)].fill} onChangeComplete={handleColorChange} />} >
                        <Button className="color-control">{<BgColorsOutlined />}</Button>
                    </Popover>
                    <div className="color-show" style={{ backgroundColor: `${shapes[Number(selectedId)].fill}` }}>
                        {`Hex: ${shapes[Number(selectedId)].fill}`}
                    </div>
                </div>
            </div>
            <Divider style={{ width: 120 , margin: 10 }} />
            <div className="shape-info stroke" >
                ??????
                <div className="color-wrap">
                    <Popover placement="bottomLeft" title="Color Picker"
                             content={<ChromePicker color={shapes[Number(selectedId)].stroke} onChangeComplete={handleStrokeColor} />} >
                        <Button className="color-control">{<BgColorsOutlined />}</Button>
                    </Popover>
                    <div className="color-show" style={{ backgroundColor: `${shapes[Number(selectedId)].stroke}` }}>
                        {`Hex: ${shapes[Number(selectedId)].stroke}`}
                    </div>
                </div>
                <div className="stroke-wrap">
                    <label >??????</label>
                    <Input name="strokeWidth" className="stroke-width" size="small" value={curShape.strokeWidth} onChange={handleInputChange}/>
                </div>
            </div>
            <Divider style={{ width: 120 , margin: 10 }} />
            <div className="shape-info shadow" >
                ??????
                <div className="shadow-wrap">
                    <Popover placement="bottomLeft" title="Color Picker"
                             content={<ChromePicker color={shapes[Number(selectedId)].shadowColor} onChangeComplete={handleShadowColor} />} >
                        <Button className="color-control">{<BgColorsOutlined />}</Button>
                    </Popover>
                    <div className="color-show" style={{ backgroundColor: `${shapes[Number(selectedId)].shadowColor}` }}>
                        {`Hex: ${shapes[Number(selectedId)].shadowColor}`}
                    </div>
                </div>
                <div className="shadow-input">
                    <Input name={'shadowOffset-x'} className="left-item input-item" size="small" suffix={'X'} value={curShape.shadowOffsetX} onChange={handleInputChange} />
                    <Input name={'shadowOffset-y'} className="input-item" size="small" suffix={'Y'} value={curShape.shadowOffsetY} onChange={handleInputChange} />
                    <Input name={'shadowOpacity'} className="input-item opacity" size="small" suffix={<TableOutlined />} value={curShape.shadowOpacity} onChange={handleInputChange} />
                </div>
            </div>
        </div> :
        <h2>??????</h2>;

    let menu = shapes.map(
        (item,index) =>
            <Menu.Item key={`${index}`}>{`??????${index + 1}`}</Menu.Item>
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {(!outPut) ? null:
                <div className="cover-black" />
            }
            {(!outPut) ? null:
                <div className="output-wrap" >
                    <div className="output-main">
                        <div className="output-header">
                            <span className="output-title">??? ????????????</span>
                            <span aria-label="Close" className="byte-modal__headerbtn" onClick={handleCancel}>
                                <i className="byte-icon byte-icon--close">
                                    <svg className="icon" viewBox="0 0 1024 1024" version="1.1"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
            d="M512 448l288-288c6.4-6.4 19.2-6.4 32 0l25.6 32c6.4 6.4 6.4 19.2 0 32L569.6 505.6l288 288c6.4 6.4 6.4 19.2 0 32l-32 32c-6.4 6.4-19.2 6.4-32 0L512 569.6l-288 288c-6.4 6.4-19.2 6.4-32 0l-32-32c-6.4-6.4-6.4-19.2 0-32L448 505.6 160 224c-6.4-12.8-6.4-25.6 0-32l32-32c6.4-6.4 19.2-6.4 32 0L512 448z"/>
                                        <path
            d="M512 448l288-288c6.4-6.4 19.2-6.4 32 0l25.6 32c6.4 6.4 6.4 19.2 0 32L569.6 505.6l288 288c6.4 6.4 6.4 19.2 0 32l-32 32c-6.4 6.4-19.2 6.4-32 0L512 569.6l-288 288c-6.4 6.4-19.2 6.4-32 0l-32-32c-6.4-6.4-6.4-19.2 0-32L448 505.6 160 224c-6.4-12.8-6.4-25.6 0-32l32-32c6.4-6.4 19.2-6.4 32 0L512 448z"/>
                                    </svg>
                                </i>
                            </span>
                        </div>
                        {strShapes}
                    </div>
                </div>
            }
            <Layout className="site-layout">
                <Menu className='menu' onClick={handleMenuClicked} selectedKeys={[current]} mode="horizontal">
                    <Menu.Item key="file" icon={<RollbackOutlined />} onClick={savePage}>
                        <Link to={'/'}>
                            Go Back
                        </Link>
                    </Menu.Item>
                    <SubMenu key="SubMenu" icon={<AppstoreOutlined />} title="??????">
                        <Menu.Item key="rect">??????</Menu.Item>
                        <Menu.Item key="circle">??????</Menu.Item>
                        <Menu.Item key="triangle">?????????</Menu.Item>
                        <Menu.Item key="star">??????</Menu.Item>
                        <Menu.Item key="text">??????</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="help" icon={<SmileOutlined />}>
                        ??????
                    </Menu.Item>
                    <Menu.Item key="alipay">
                        <a href="https://github.com/Breeze-P/bytedance-camp-project" target="_blank" rel="noopener noreferrer">
                            Github Link
                        </a>
                    </Menu.Item>
                    <Menu.Item key="output" icon={<LogoutOutlined />}>
                        ??????
                    </Menu.Item>
                </Menu>
                <Layout>
                    <Sider className="site-layout-background sider" >
                        <h2>??????</h2>
                        <Menu
                            onClick={handleSiderClicked}
                            style={{ width: 200 }}
                            selectedKeys={[siderCurrent]}
                            mode="inline"
                        >
                            {menu}
                        </Menu>
                    </Sider>
                    <Content className="site-layout-background content-container">
                        <div className="page-wrap">
                            <Stage
                                width={window.innerWidth}
                                height={window.innerHeight}
                                onMouseDown={checkDeselect}
                                onTouchStart={checkDeselect}
                            >
                                <Layer>
                                    {shapes.map((item, index) => {
                                        return (
                                            <ShapeItem
                                                key={index}
                                                shapeProps={item}
                                                isSelected={item.id === selectedId}
                                                onSelect={() => {
                                                    selectShape(item.id);
                                                    setSiderCurrent(item.id)
                                                }}
                                                onChange={handleShapeChange}
                                            />
                                        );
                                    })}
                                </Layer>
                            </Stage>
                        </div>
                    </Content>
                    <Sider className="site-layout-background sider" >
                        {siderRight}
                    </Sider>
                </Layout>
                <Footer style={{ textAlign: 'center' }}>Author: Breeze-P | Github:
                    <a href="https://github.com/Breeze-P" style={{ whiteSpace: "pre" }}>  https://github.com/Breeze-P</a>
                </Footer>
            </Layout>
        </Layout>
    )
}

export default Page