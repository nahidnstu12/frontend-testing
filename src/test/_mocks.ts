import { vi } from "vitest";

vi.mock("@/store/authContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/store/api", () => ({
    default: {
        post: vi.fn()
    }
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// vi.mock("@/store/api", () => ({
//   default: {
//     post: vi.fn().mockResolvedValue({
//       data: {
//         token:
//           "header." +
//           btoa(JSON.stringify({ id: 1, name: "Test User" })) +
//           ".signature",
//       },
//     }),
//   },
// }));

// vi.mock("@/store/api", () => ({
//     default: {
//         post: vi.fn().mockRejectedValue({
//             message: "Invalid credentials"
//         })
//     }
// }))