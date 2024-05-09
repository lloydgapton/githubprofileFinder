import React, { useEffect, useState } from 'react';

function GitHubProfile({ username, accessToken }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchGitHubData(username, accessToken);
      setUserData(data);
    };
    fetchData();
  }, [username, accessToken]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>GitHub Profile</h2>
      <p>Username: {userData.login}</p>
      <p>Name: {userData.name}</p>
      <p>Followers: {userData.followers}</p>
      <p>Repositories: {userData.public_repos}</p>
      <p>Bio: {userData.bio}</p>
      <img src={userData.avatar_url} alt="Avatar" />
    </div>
  );
}

export default GitHubProfile;