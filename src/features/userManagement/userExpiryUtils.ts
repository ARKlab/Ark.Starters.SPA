export type RowClass = "k4viewEmailExpired" | "k4viewEmail" | "expired" | "";

export interface ExpiryStatus {
  status: "expired" | "active";
  isK4ViewEmail: boolean;
  rowClass: RowClass;
  daysUntilExpiry: number;
  colorScheme: {
    bg: string;
    color: string;
  };
}

export function getUserExpiryStatus(expiryDate: string | number | undefined, email?: string): ExpiryStatus {
  const isK4ViewEmail = email ? email.toLowerCase().includes("k4view.com") : false;

  if (!expiryDate) {
    return {
      status: "active",
      isK4ViewEmail,
      rowClass: isK4ViewEmail ? "k4viewEmail" : "",
      daysUntilExpiry: Infinity,
      colorScheme: {
        bg: isK4ViewEmail ? "table.k4viewEmail" : "bg.page",
        color: "fg",
      },
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = daysUntilExpiry <= 0;

  let rowClass: RowClass = "";
  if (isK4ViewEmail && isExpired) {
    rowClass = "k4viewEmailExpired";
  } else if (isK4ViewEmail) {
    rowClass = "k4viewEmail";
  } else if (isExpired) {
    rowClass = "expired";
  }

  let colorScheme: { bg: string; color: string };
  switch (rowClass) {
    case "k4viewEmailExpired":
      colorScheme = { bg: "table.k4viewEmailExpired", color: "error.fg" };
      break;
    case "k4viewEmail":
      colorScheme = { bg: "table.k4viewEmail", color: "fg" };
      break;
    case "expired":
      colorScheme = { bg: "table.expired", color: "error.fg" };
      break;
    default:
      colorScheme = { bg: "bg.page", color: "fg" };
  }

  return {
    status: isExpired ? "expired" : "active",
    isK4ViewEmail,
    rowClass,
    daysUntilExpiry,
    colorScheme,
  };
}

export function getExpiryStatusText(status: ExpiryStatus): string {
  switch (status.status) {
    case "expired":
      return `Expired ${Math.abs(status.daysUntilExpiry)} days ago`;
    case "active":
      return status.daysUntilExpiry === Infinity ? "No expiry date" : `Expires in ${status.daysUntilExpiry} days`;
    default:
      return "Unknown status";
  }
}
