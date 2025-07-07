import DataTable from "@/components/datatable";
import type { CustomColumnDef } from "@/components/datatable/type";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { setTableParams } from "@/store/features/datatableSlice";
import { type RootState } from "@/store/store";
import { type BreadcrumbItem } from "@/types/shared";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { toast } from "sonner";
import { AddEditForm } from "./AddEditForm";
import ModalWrapper from "../../../components/wrapper/modal-wrapper";
import {
  useDeleteStaticContentMutation,
  useGetStaticContentsQuery,
  type StaticContent,
} from "@/store/services/staticContentsApi";
import { TAGS_KEY } from "@/store/apiRoutes";
// import { useGetOrganizationsQuery } from "@/store/services/organizationApi";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Static Contents",
    href: "/static-contents",
  },
];

const tableKey = TAGS_KEY.STATIC_CONTENT;

export default function StaticContents() {
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

  const { data, isLoading } = useGetStaticContentsQuery(tableState);
  // const { data: organizations } = useGetOrganizationsQuery();
  // console.log("organizations>>", organizations);
  const [deleteStaticContent] = useDeleteStaticContentMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaticContent, setEditingStaticContent] = useState<
    number | null
  >(null);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this staticContent?")) {
      try {
        await deleteStaticContent(id).unwrap();
        toast.success("StaticContent deleted successfully");
      } catch (error) {
        toast.error("Failed to delete staticContent");
      }
    }
  };

  const handleEdit = (staticContent: StaticContent) => {
    setEditingStaticContent(staticContent.id);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingStaticContent(null);
    setIsModalOpen(true);
  };

  const handleView = (staticContent: StaticContent) => {
    console.log(staticContent);
  };

  const columns: CustomColumnDef<StaticContent>[] = [
    {
      header: "Title",
      accessorKey: "title",
      enableColumnFilter: true,
      filterField: "input",
    },
    {
      header: "Code",
      accessorKey: "code",
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
          title={
            editingStaticContent
              ? "Edit Static Content"
              : "Create Static Content"
          }
        >
          <AddEditForm
            onCancel={() => {
              setIsModalOpen(false);
              setEditingStaticContent(null);
            }}
            isEditing={editingStaticContent}
          />
        </ModalWrapper>

        <DataTable
          columns={columns}
          title="Static Contents"
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
