import apiClient from "../lib/axios";

export interface CartCheckoutItemPayload {
  productId: string;
  quantity: number;
}

export interface CartCheckoutPayload {
  fullName: string;
  phoneNumber: string;
  email?: string;
  address: string;
  note?: string;
  items: CartCheckoutItemPayload[];
}

export interface ConsultationResponse {
  id: string;
  customer: {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string | null;
  };
  address: string | null;
  message: string | null;
  source: string;
  status: string;
  items: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      slug: string;
      price: number | null;
    };
  }[];
  createdAt: string;
  updatedAt: string;
}

const consultationService = {
  createCartCheckout: async (
    payload: CartCheckoutPayload,
  ): Promise<ConsultationResponse> => {
    return apiClient.post<ConsultationResponse, CartCheckoutPayload>(
      "/consultations/checkout",
      payload,
    );
  },
};

export default consultationService;
