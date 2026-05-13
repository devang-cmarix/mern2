// src/utils/orderStatus.ts

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

// Defines which statuses admin can transition TO from current status
export const getAllowedTransitions = (current: OrderStatus): OrderStatus[] => {
  switch (current) {
    case "pending":
      return ["pending", "processing", "cancelled"];
    case "processing":
      return ["processing", "shipped", "cancelled"];
    case "shipped":
      return ["shipped", "delivered", "cancelled"];
    case "delivered":
      return ["delivered"]; // ✅ Final state — no changes allowed
    case "cancelled":
      return ["cancelled"]; // ✅ Final state — no changes allowed
    default:
      return [current];
  }
};

export const formatStatus = (status: OrderStatus): string => {
  switch (status) {
    case "processing": return "In Progress";
    case "pending":    return "Pending";
    case "shipped":    return "Shipped";
    case "delivered":  return "Delivered";
    case "cancelled":  return "Cancelled";
    default:           return status;
  }
};
