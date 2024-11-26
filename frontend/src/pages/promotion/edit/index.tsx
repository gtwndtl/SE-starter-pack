import { useState, useEffect } from "react";
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
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { GetPromotionById, UpdatePromotionById, GetPromotionType,} from "../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
import dayjs from "dayjs";

function PromotionEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [promotionTypes, setPromotionTypes] = useState<
    { id: number; name: string }[]
  >([]);
  const [form] = Form.useForm();

  const getPromotionById = async (id: string) => {
    let res = await GetPromotionById(id);
    if (res.status === 200) {
      form.setFieldsValue({
        name: res.data.name,
        code: res.data.code,
        details: res.data.details,
        start_date: dayjs(res.data.start_date),
        end_date: dayjs(res.data.end_date),
        type_id: res.data.type_id,
      });
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลโปรโมชั่น",
      });
      setTimeout(() => {
        navigate("/promotions");
      }, 2000);
    }
  };

  const getPromotionTypes = async () => {
    let res = await GetPromotionType();
    if (res.status === 200) {
      setPromotionTypes(res.data);
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่สามารถโหลดข้อมูลประเภทโปรโมชั่นได้",
      });
    }
  };

  const onFinish = async (values: any) => {
    let payload = {
      ...values,
    };

    const res = await UpdatePromotionById(id, payload);
    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/promotion");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getPromotionTypes();
    getPromotionById(id);
  }, [id]);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>แก้ไขข้อมูลโปรโมชั่น</h2>
        <Divider />
        <Form
          name="promotion-edit"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Form.Item
                label="ชื่อโปรโมชั่น"
                name="name"
                rules={[{ required: true, message: "กรุณากรอกชื่อโปรโมชั่น!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="รหัสโปรโมชั่น"
                name="code"
                rules={[{ required: true, message: "กรุณากรอกรหัสโปรโมชั่น!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="รายละเอียด"
                name="details"
                rules={[{ required: true, message: "กรุณากรอกรายละเอียด!" }]}
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="วันที่เริ่ม"
                name="start_date"
                rules={[{ required: true, message: "กรุณาเลือกวันที่เริ่ม!" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="วันที่สิ้นสุด"
                name="end_date"
                rules={[{ required: true, message: "กรุณาเลือกวันที่สิ้นสุด!" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="ประเภทโปรโมชั่น"
                name="type_id"
                rules={[{ required: true, message: "กรุณาเลือกประเภทโปรโมชั่น!" }]}
              >
                <Select style={{ width: "100%" }}>
                  {promotionTypes.map((promotion_type) => (
                    <Select.Option key={promotion_type.ID} value={promotion_type.ID}>
                      {promotion_type.type}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Col>
              <Form.Item>
                <Space>
                  <Link to="/promotion">
                    <Button htmlType="button" style={{ marginRight: "10px" }}>
                      ยกเลิก
                    </Button>
                  </Link>
                  <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                    บันทึก
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default PromotionEdit;
