import { Button } from "@/components/ui/button";
import DataTable from "@/components/datatable";
import type { CustomColumnDef } from "@/components/datatable/type";
import ModalWrapper from "@/components/wrapper/modal-wrapper";
import AppLayout from "@/layouts/app-layout";
import {
  useDeleteUserByAdminMutation,
  useGetUsersQuery,
} from "@/store/services/userApi";
import { type BreadcrumbItem, type User } from "@/types/shared";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AddEditForm } from "./AddEditForm";
import { TAGS_KEY } from "@/store/apiRoutes";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Users",
    href: "/users",
  },
];

const tableKey = TAGS_KEY.USER;

export default function Users() {
  const { data, isLoading } = useGetUsersQuery();

  const columns: CustomColumnDef<User>[] = [
    {
      header: "Name",
      accessorKey: "full_name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Role",
      accessorKey: "user_type",
    },
    {
      header: "Status",
      accessorKey: "status",
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

  const [deleteUser] = useDeleteUserByAdminMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id.toString()).unwrap(); // TODO: fix this, when name will change to id
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user.username);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleView = (user: User) => {
    console.log(user);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Users</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <ModalWrapper
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          title={editingUser ? "Edit User" : "Create User"}
        >
          <AddEditForm
            // onSubmit={handleSubmit}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingUser(null);
            }}
            isEditing={editingUser}
          />
        </ModalWrapper>

        <DataTable
          columns={columns}
          title="Users"
          tableKey={tableKey}
          data={data?.users || []}
          // paginationMeta={{
          //   total_records: data?.total_records || 0,
          //   page_size: data?.page_size || 0,
          //   current_page: data?.current_page || 0,
          //   total_pages: data?.total_pages || 0,
          // }}
          paginationMeta={{
            total_records: 0,
            page_size: 0,
            current_page: 0,
            total_pages: 0,
          }}
          isLoading={isLoading}
          openModal={handleAddNew}
        />
      </div>
    </AppLayout>
  );
}
