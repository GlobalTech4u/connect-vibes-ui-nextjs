"use client";

import { use } from "react";
import Profile from "@/components/profile/Profile";

export default function Page({ params }) {
  const unwrappedParams = use(params);

  return <Profile userId={unwrappedParams?.id || ""} />;
}
