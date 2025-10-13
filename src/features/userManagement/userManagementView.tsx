import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import { z } from "zod";

import { ChackraPlainTable } from "../../components/tables/plainTable/chackraPlainTable";

import { fakeUserManagementData } from "./fakeUserManagementData";

export const UserTableDataSchema = z.object({
  User: z.string(),
  Company: z.string(),
  Name: z.string(),
  Surname: z.string(),
  Phone: z.string(),
  "Expiry Date": z.string(),
});

export type UserTableDataType = z.infer<typeof UserTableDataSchema>;

// Define the structure of Auth0 user data
interface Auth0UserData {
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  user_id?: string;
  app_metadata?: {
    company?: string;
    expiry_date?: string | number;
    primary_user_id?: string;
    expiryDate?: string;
  };
  user_metadata?: {
    name?: string;
    given_name?: string;
    family_name?: string;
    phone_number?: string | null;
    country?: string;
  };
}

// Transform the Auth0 user data to match the table schema
const transformUserData = (userData: Auth0UserData[]): UserTableDataType[] => {
  return userData.map(user => ({
    User: user.email ?? '',
    Company: user.app_metadata?.company ?? '',
    Name: user.user_metadata?.given_name ?? user.given_name ?? '',
    Surname: user.user_metadata?.family_name ?? user.family_name ?? '',
    Phone: user.user_metadata?.phone_number ?? '',
    "Expiry Date": user.app_metadata?.expiry_date ? 
      (typeof user.app_metadata.expiry_date === 'string' ? 
        user.app_metadata.expiry_date.split('T')[0] : 
        String(user.app_metadata.expiry_date)) : '',
  }));
};

const UserManagementView = () => {
  const transformedData = transformUserData(fakeUserManagementData);

  return (
    <Box>
      <Heading mb="4">User Management</Heading>
      <ChackraPlainTable
        colorPalette="primary"
        data={transformedData}
        isLoading={false}
        isError={false}
        error={undefined}
        schema={UserTableDataSchema}
      />
    </Box>
  );
};

export default UserManagementView;
