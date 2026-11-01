import React from 'react';
import { getBranches } from '@/lib/data-service';
import AdminBranchesClient from '@/components/admin/AdminBranchesClient';

export const revalidate = 0;

export default async function AdminBranchesPage() {
  const branches = await getBranches(false); // All branches
  return <AdminBranchesClient initialBranches={branches} />;
}

