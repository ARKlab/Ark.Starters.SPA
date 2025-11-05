export interface ExpiryStatus {
  status: "expired" | "expiring-soon" | "active";
  daysUntilExpiry: number;
  colorScheme: {
    bg: string;
    color: string;
  };
}

export function getUserExpiryStatus(expiryDate: string | number | undefined): ExpiryStatus {
  if (!expiryDate) {
    return {
      status: "active",
      daysUntilExpiry: Infinity,
      colorScheme: {
        bg: "bg.page",
        color: "fg",
      },
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) {
    return {
      status: "expired",
      daysUntilExpiry,
      colorScheme: {
        bg: "table.expired",
        color: "error.fg",
      },
    };
  } else if (daysUntilExpiry <= 30) {
    return {
      status: "expiring-soon",
      daysUntilExpiry,
      colorScheme: {
        bg: "table.expiringSoon",
        color: "status.muted",
      },
    };
  } else {
    return {
      status: "active",
      daysUntilExpiry,
      colorScheme: {
        bg: "bg.page",
        color: "fg",
      },
    };
  }
}

export function getExpiryStatusText(status: ExpiryStatus): string {
  switch (status.status) {
    case "expired":
      return `Expired ${Math.abs(status.daysUntilExpiry)} days ago`;
    case "expiring-soon":
      return `Expires in ${status.daysUntilExpiry} days`;
    case "active":
      return status.daysUntilExpiry === Infinity ? "No expiry date" : `Expires in ${status.daysUntilExpiry} days`;
    default:
      return "Unknown status";
  }
}
