import { useState, useEffect } from "react";
import {
  Space,
  Table,
  Button,
  Col,
  Row,
  Divider,
  message,
  Modal,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  GetPromotions,
  DeletePromotionById,
  GetPromotionType,
  GetPromotionStatus, // Assuming this is the new API for fetching status
} from "../../services/https/index";
import { PromotionInterface } from "../../interfaces/Promotion";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function Promotions() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<PromotionInterface[]>([]);
  const [promotionTypes, setPromotionTypes] = useState<Record<number, string>>({});
  const [promotionStatuses, setPromotionStatuses] = useState<Record<number, string>>({}); // New state for statuses
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionInterface | null>(null);

  const columns: ColumnsType<PromotionInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
    },
    {
      title: "ชื่อโปรโมชั่น",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "รหัสโปรโมชั่น",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "รายละเอียด",
      dataIndex: "details",
      key: "details",
    },
    {
      title: "วันที่เริ่ม",
      key: "start_date",
      render: (record) => <>{dayjs(record.start_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "วันที่สิ้นสุด",
      key: "end_date",
      render: (record) => <>{dayjs(record.end_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "ส่วนลด",
      key: "trip_discount",
      render: (record) => <>{record.trip_discount}%</>,
    },
    {
      title: "สถานะ",
      key: "status",
      render: (record) => <>{promotionStatuses[record.status_id] || "ไม่ระบุ"}</>, // Map status using promotionStatuses
    },
    {
      title: "ประเภท",
      key: "type",
      render: (record) => <>{promotionTypes[record.type_id] || "ไม่ระบุ"}</>, // Map type using promotionTypes
    },
    {
      title: "",
      render: (record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/promotion/edit/${record.ID}`)}
          >
            แก้ไขข้อมูล
          </Button>
          <Button
            type="dashed"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteModal(record)}
          />
        </Space>
      ),
    },
  ];

  const showDeleteModal = (record: PromotionInterface) => {
    setSelectedPromotion(record);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPromotion) return;

    const res = await DeletePromotionById(selectedPromotion.ID);
    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      await getPromotions();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error || "ไม่สามารถลบโปรโมชั่นได้",
      });
    }
    setIsModalOpen(false);
  };

  const getPromotions = async () => {
    const res = await GetPromotions();
    if (res.status === 200) {
      setPromotions(res.data);
    } else {
      setPromotions([]);
      messageApi.open({
        type: "error",
        content: res.data.error || "ไม่สามารถโหลดข้อมูลโปรโมชั่นได้",
      });
    }
  };

  const getPromotionTypes = async () => {
    const res = await GetPromotionType();
    if (res.status === 200) {
      const typeMap = res.data.reduce(
        (acc: Record<number, string>, promotion_type: { ID: number; type: string }) => {
          acc[promotion_type.ID] = promotion_type.type; // Mapping type_id to type name
          return acc;
        },
        {}
      );
      setPromotionTypes(typeMap); // Store in state
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error || "ไม่สามารถโหลดข้อมูลประเภทโปรโมชั่นได้",
      });
    }
  };

  const getPromotionStatuses = async () => { // New function for getting promotion statuses
    const res = await GetPromotionStatus();
    if (res.status === 200) {
      const statusMap = res.data.reduce(
        (acc: Record<number, string>, promotion_status: { ID: number; status: string }) => {
          acc[promotion_status.ID] = promotion_status.status; // Map status ID to status name
          return acc;
        },
        {}
      );
      setPromotionStatuses(statusMap); // Store status names in state
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error || "ไม่สามารถโหลดข้อมูลสถานะโปรโมชั่นได้",
      });
    }
  };

  useEffect(() => {
    getPromotions();
    getPromotionTypes();
    getPromotionStatuses(); // Fetch promotion statuses
  }, []);

  return (
    <>
      {contextHolder}

      <Row>
        <Col span={12}>
          <h2>จัดการข้อมูลโปรโมชั่น</h2>
        </Col>

        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/promotion/create">
              <Button type="primary" icon={<PlusOutlined />}>
                สร้างข้อมูล
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>

      <Divider />

      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={promotions}
          style={{ width: "100%", overflow: "scroll" }}
        />
      </div>

      <Modal
        title="ยืนยันการลบ"
        open={isModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        okText="ลบ"
        cancelText="ยกเลิก"
      >
        <p>
          คุณแน่ใจหรือไม่ที่จะลบโปรโมชั่น{" "}
          <strong>{selectedPromotion?.name}</strong>?
        </p>
      </Modal>
    </>
  );
}

export default Promotions;
