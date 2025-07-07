import DataTable from "@/components/datatable";
import type { CustomColumnDef } from "@/components/datatable/type";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { setTableParams } from "@/store/features/datatableSlice";
import {
  useDeleteNoticeMutation,
  useGetNoticesQuery,
  type Notice,
} from "@/store/services/noticeApi";
import { type RootState } from "@/store/store";
import { type BreadcrumbItem } from "@/types/shared";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { toast } from "sonner";
import { AddEditForm } from "./AddEditForm";
import ModalWrapper from "../../../components/wrapper/modal-wrapper";
import { TAGS_KEY } from "@/store/apiRoutes";
// import { useGetOrganizationsQuery } from "@/store/services/organizationApi";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Notices",
    href: "/notices",
  },
];

const tableKey = TAGS_KEY.NOTICE;

export default function Notices() {
  const location = useLocation();
  const dispatch = useDispatch();

  const tableState = useSelector(
    (state: RootState) =>
      state.datatable[tableKey] || { page: 1, page_size: 10 }
  );

  // Parse URL search params and sync to Redux on location change
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newParams = {
      page: parseInt(searchParams.get("page") || "1"),
      page_size: parseInt(searchParams.get("page_size") || "10"),
      sort: searchParams.get("sort") || undefined,
      order: (searchParams.get("order") as "asc" | "desc") || undefined,
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
    };
    dispatch(setTableParams({ key: tableKey, params: newParams }));
  }, [location.search, dispatch]);

  const { data, isLoading } = useGetNoticesQuery(tableState);
  // const { data: organizations } = useGetOrganizationsQuery();
  // console.log("organizations>>", organizations);
  const [deleteNotice] = useDeleteNoticeMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        await deleteNotice(id).unwrap();
        toast.success("Notice deleted successfully");
      } catch (error) {
        toast.error("Failed to delete notice");
      }
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice.id);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingNotice(null);
    setIsModalOpen(true);
  };

  const handleView = (notice: Notice) => {
    console.log(notice);
  };

  const columns: CustomColumnDef<Notice>[] = [
    {
      header: "Title",
      accessorKey: "title",
      enableColumnFilter: true,
      filterField: "input",
    },
    {
      header: "Body",
      accessorKey: "body",
    },
    {
      header: "Cover Image",
      accessorKey: "cover_image",
      cell: ({ row }) => {
        return (
          <img
            src={row.original.cover_image}
            alt="Cover Image"
            className="w-12 h-12 object-cover rounded"
          />
        );
      },
    },
    {
      header: "Organization",
      accessorKey: "organization.name",
      enableColumnFilter: true,
      filterField: "select",
      filteredItems: [
        { label: "Organization 1", value: "1" },
        { label: "Organization 2", value: "2" },
      ],
    },
    {
      header: "Publish Date",
      accessorKey: "publish_date",
      cell: ({ row }) => {
        return (
          <span className="text-sm text-gray-500">
            {new Date(row.original.publish_date).toLocaleDateString()}
          </span>
        );
      },
      filterField: "date",
      enableColumnFilter: true,
    },
    {
      header: "Archieve Date",
      accessorKey: "archive_date",
      cell: ({ row }) => {
        return (
          <span className="text-sm text-gray-500">
            {new Date(row.original.archive_date).toLocaleDateString()}
          </span>
        );
      },
      filterField: "daterange",
      enableColumnFilter: true,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        return (
          <span className="text-sm text-gray-500">{row.original.status}</span>
        );
      },
      filterField: "select",
      enableColumnFilter: true,
      filteredItems: [
        { label: "Published", value: "published" },
        { label: "Pending", value: "pending" },
        { label: "Draft", value: "draft" },
      ],
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(row.original)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col gap-4">
        <ModalWrapper
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          title={editingNotice ? "Edit Notice" : "Create Notice"}
        >
          <AddEditForm
            onCancel={() => {
              setIsModalOpen(false);
              setEditingNotice(null);
            }}
            isEditing={editingNotice}
          />
        </ModalWrapper>

        <DataTable
          columns={columns}
          title="Notices"
          tableKey={tableKey}
          data={data?.data || []}
          paginationMeta={data?.meta}
          isLoading={isLoading}
          openModal={handleAddNew}
        />
      </div>
    </AppLayout>
  );
}
