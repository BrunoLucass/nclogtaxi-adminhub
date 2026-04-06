// ─── Auth ────────────────────────────────────────────────────────────────────

export type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

// ─── Error shapes ────────────────────────────────────────────────────────────

export type ApiValidationErrorBody = {
  error?: string;
  details?: Record<string, string[]>;
};

export type ApiSimpleErrorBody = {
  error?: string;
  message?: string;
};

// ─── Pagination ───────────────────────────────────────────────────────────────

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
};

/** Some endpoints use flat shape: { data, page, limit, total } */
export type FlatPaginatedResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
};

// ─── Organizations ────────────────────────────────────────────────────────────

export type OrganizationStatus = 'active' | 'suspended' | 'delinquent';

export type Organization = {
  id: string;
  name: string;
  monthlyFeeCents?: number;
  perTripFeeCents?: number;
  status?: OrganizationStatus;
  maxTripsPerMonth?: number | null;
  createdAt?: string;
};

export type CreateOrganizationInput = {
  name: string;
  monthlyFeeCents: number;
  perTripFeeCents: number;
};

export type UpdateOrganizationInput = {
  name?: string;
  monthlyFeeCents?: number;
  perTripFeeCents?: number;
  maxTripsPerMonth?: number | null;
};

export type BillingHistoryEntry = {
  month: string;
  tripCount: number;
  completedTripCount: number;
  voucherTotal: { open: number; closed: number; disputed: number };
  voucherAmountCents: number;
};

// ─── Users ────────────────────────────────────────────────────────────────────

export type ApiUser = {
  id: string;
  email: string;
  role: string;
  organizationId?: string | null;
  bannedUntil?: string | null;
};

export type CreateUserInput = {
  email: string;
  password: string;
  role: 'requester' | 'client_manager' | 'driver';
  organizationId?: string;
  /** Required if role === 'driver' */
  name?: string;
  /** Required if role === 'driver' */
  phone?: string;
};

export type UpdateUserInput = {
  email?: string;
  role?: string;
  organizationId?: string;
};

// ─── Drivers ─────────────────────────────────────────────────────────────────

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

export type UpdateDriverInput = {
  name?: string;
  phone?: string;
};

export type DriverStats = {
  totalTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  acceptanceRate: number;
  dailyAverage: number;
  revenueGeneratedCents: number;
  periodStart: string;
  periodEnd: string;
};

export type DriverDocument = {
  id: string;
  driverId: string;
  type: 'cnh' | 'vehicle_doc' | 'other';
  url: string;
  filename: string;
  mimeType: string;
  uploadedAt: string;
};

// ─── Vehicles ─────────────────────────────────────────────────────────────────

export type Vehicle = {
  id: string;
  plate: string;
  model: string;
  year?: number;
  color?: string;
  driverId?: string | null;
  isActive?: boolean;
  licenceUrl?: string | null;
  createdAt?: string;
};

export type CreateVehicleInput = {
  plate: string;
  model: string;
  year: number;
  color: string;
  driverId?: string;
};

export type UpdateVehicleInput = {
  plate?: string;
  model?: string;
  year?: number;
  color?: string;
};

// ─── Trips ────────────────────────────────────────────────────────────────────

export type Trip = {
  id: string;
  status?: string;
  passengerName?: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  costCenter?: string;
  organizationId?: string;
  driverId?: string;
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

export type TripFilters = {
  status?: string;
  organizationId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

// ─── Vouchers ─────────────────────────────────────────────────────────────────

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

export type VoucherFilters = {
  organizationId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

// ─── Webhooks ────────────────────────────────────────────────────────────────

export type Webhook = {
  id: string;
  url: string;
  organizationId?: string;
  /** Only returned on creation */
  secret?: string;
  createdAt?: string;
};

// ─── Reports ──────────────────────────────────────────────────────────────────

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

export type MonthlyReportEntry = {
  organizationId?: string;
  organizationName?: string;
  tripCount: number;
  completedTripCount: number;
  cancelledTripCount: number;
  revenueCents: {
    monthlyFee: number;
    perTripFees: number;
    total: number;
  };
  voucherSummary: {
    open: number;
    closed: number;
    disputed: number;
  };
};

export type DriverPerformanceReport = {
  driverId: string;
  driverName: string;
  period: { start: string; end: string };
  totalTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  acceptanceRate: number;
  dailyAverage: number;
  revenueGeneratedCents: number;
};
