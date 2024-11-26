import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  DatePicker,
  InputNumber,
  Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreatePromotion, GetPromotionType } from "../../../services/https";

interface PromotionTypeInterface {
  ID: number;
  type: string;
}

function PromotionCreate() {
  const navigate = useNavigate(); // สร้าง instance ของ navigate
  const [typeId, setTypeId] = useState<number | null>(null);
  const [promotionTypes, setPromotionTypes] = useState<PromotionTypeInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchPromotionTypes = async () => {
      try {
        const response = await GetPromotionType();
        if (response.status === 200) {
          setPromotionTypes(response.data);
        } else {
          message.error("ไม่สามารถโหลดประเภทโปรโมชั่นได้!");
        }
      } catch (error) {
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล!");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionTypes();
  }, []);

  const onFinish = async (values: any) => {
    const formattedValues = {
      ...values,
      type_id: typeId,
      start_date: values.start_date,
      end_date: values.end_date,
    };

    try {
      const res = await CreatePromotion(formattedValues);
      if (res.status === 201) {
        messageApi.open({
          type: "success",
          content: "สร้างโปรโมชั่นสำเร็จ!",
        });
        setTimeout(() => {
          navigate("/promotion");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error || "ไม่สามารถสร้างโปรโมชั่นได้!",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการสร้างโปรโมชั่น!",
      });
    }
  };

  const renderAdditionalFields = () => {
    if (typeId === 2) {
      return (
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            label="รูปภาพ"
            name="picture"
            rules={[{ required: true, message: "กรุณาอัปโหลดรูปภาพ!" }]}>
            <Input type="file" />
          </Form.Item>
        </Col>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>{typeId ? "เพิ่มข้อมูลโปรโมชั่น" : "เลือกประเภทโปรโมชั่น"}</h2>
        <Divider />
        {!typeId ? (
          <Row gutter={[16, 16]} justify="center">
            {promotionTypes.map((type) => (
              <Col key={type.ID} xs={24} sm={12} md={8}>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={() => setTypeId(type.ID)}
                >
                  {type.type}
                </Button>
              </Col>
            ))}
            <Col xs={24} sm={12} md={8}>
              <Button
                type="default"
                size="large"
                block
                onClick={() => navigate("/promotion")} // Redirect to /promotion
                style={{ marginTop: "20px" }}
              >
                ยกเลิก
              </Button>
            </Col>
          </Row>
        ) : (
          <Form
            form={form}
            name="promotion_create"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="ชื่อโปรโมชั่น"
                  name="name"
                  rules={[{ required: true, message: "กรุณากรอกชื่อโปรโมชั่น!" }]}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="รหัสโปรโมชั่น"
                  name="code"
                  rules={[{ required: true, message: "กรุณากรอกรหัสโปรโมชั่น!" }]}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24}>
                <Form.Item
                  label="รายละเอียด"
                  name="details"
                  rules={[{ required: true, message: "กรุณากรอกรายละเอียด!" }]}>
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="วันที่เริ่มต้น"
                  name="start_date"
                  rules={[{ required: true, message: "กรุณาเลือกวันที่เริ่มต้น!" }]}>
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="วันที่สิ้นสุด"
                  name="end_date"
                  rules={[{ required: true, message: "กรุณาเลือกวันที่สิ้นสุด!" }]}>
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="ส่วนลด (%)"
                  name="trip_discount"
                  rules={[{ required: true, message: "กรุณากรอกส่วนลด!" }]}>
                  <InputNumber
                    min={0}
                    max={100}
                    formatter={(value) => `${value}%`}
                    parser={(value) => value?.replace("%", "") || ""}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="จำนวน"
                  name="limit"
                  rules={[{ required: true, message: "กรุณากรอกจำนวน!" }]}>
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              {renderAdditionalFields()}
            </Row>

            <Row justify="end">
              <Col style={{ marginTop: "40px" }}>
                <Form.Item>
                  <Space>
                    <Button
                      htmlType="button"
                      style={{ marginRight: "10px" }}
                      onClick={() => setTypeId(null)}
                    >
                      ย้อนกลับ
                    </Button>

                    <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                      ยืนยัน
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Card>
    </div>
  );
}

export default PromotionCreate;
