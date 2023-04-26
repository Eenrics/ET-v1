const checkRole = (roles, role) => {
    if (roles.includes(role)) {
      return true;
    } else {
      return false
    }
  };
  
  export default checkRole;