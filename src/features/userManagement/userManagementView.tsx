import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
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

// Transform the Auth0 user data to match the table schema
const transformUserData = (userData: any[]): UserTableDataType[] => {
  return userData.map(user => ({
    User: user.email || '',
    Company: user.app_metadata?.company || '',
    Name: user.user_metadata?.given_name || user.given_name || '',
    Surname: user.user_metadata?.family_name || user.family_name || '',
    Phone: user.user_metadata?.phone_number || '',
    "Expiry Date": user.app_metadata?.expiry_date ? 
      (typeof user.app_metadata.expiry_date === 'string' ? 
        user.app_metadata.expiry_date.split('T')[0] : 
        String(user.app_metadata.expiry_date)) : '',
  }));
};

const UserManagementView = () => {
  const { t } = useTranslation();
  
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
