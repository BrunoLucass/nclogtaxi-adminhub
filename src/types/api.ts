export type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type ApiValidationErrorBody = {
  error?: string;
  details?: Record<string, string[]>;
};

export type ApiSimpleErrorBody = {
  error?: string;
  message?: string;
};

/** GET /organizations */
export type Organization = {
  id: string;
  name: string;
  monthlyFeeCents?: number;
  perTripFeeCents?: number;
  createdAt?: string;
};

export type CreateOrganizationInput = {
  name: string;
  monthlyFeeCents: number;
  perTripFeeCents: number;
};

/** GET /drivers */
export type Driver = {
  id: string;
  name: string;
  phone?: string;
  isAvailable?: boolean;
  queuePosition?: number;
  [key: string]: unknown;
};

export type CreateDriverInput = {
  id: string;
  name: string;
  phone?: string;
};

/** GET /trips */
export type Trip = {
  id: string;
  status?: string;
  passengerName?: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  costCenter?: string;
  organizationId?: string;
  createdAt?: string;
  amountCents?: number;
  [key: string]: unknown;
};

export type CreateTripInput = {
  passengerName: string;
  pickupAddress: string;
  dropoffAddress: string;
  costCenter?: string;
};

/** GET /vouchers */
export type Voucher = {
  id: string;
  tripId?: string;
  organizationId?: string;
  amountCents?: number;
  status?: string;
  closedAt?: string | null;
  createdAt?: string;
  [key: string]: unknown;
};

/** GET /reports/daily */
export type DailyTripReport = {
  organizationId?: string;
  organizationName?: string;
  date: string;
  totalTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  totalAmountCents: number;
  trips?: Trip[];
};
