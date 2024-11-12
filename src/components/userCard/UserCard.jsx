"use client";
import * as React from "react";
import { useRouter } from "next/navigation";

import { Avatar, Card, CardContent } from "@mui/material";

import { getFullName } from "@/helpers/user.helper";

import "./UserCard.css";

const UserCard = (props) => {
  const { user, onHideSearchResults } = props;
  const router = useRouter();

  const navigateToUserProfile = () => {
    onHideSearchResults();
    router.push(`/profile/${user?._id}`);
  };

  const profilePicturePath =
    user?.profilePictures?.length > 0
      ? user?.profilePictures[0]?.picture?.path
      : "";

  return (
    <Card
      className="user-search-card-container cursor-pointer"
      sx={{ marginTop: 2, marginLeft: 3, marginRight: 3 }}
      onClick={navigateToUserProfile}
      key={`search-${user?._id}`}
      data-testid="user-search-card-container"
    >
      <CardContent className="card-content">
        <Avatar aria-label="recipe" src={profilePicturePath} />
        <span className="name">
          {getFullName(user?.firstName, user?.lastName)}
        </span>
      </CardContent>
    </Card>
  );
};

export default UserCard;
