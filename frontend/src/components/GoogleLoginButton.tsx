import { Button } from "@chakra-ui/react";

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      colorPalette="blue"
      color="white"
      _hover={{ bg: "blue.700" }}
      w="full"
    >
      Sign in with Google
    </Button>
  );
};

export default GoogleLoginButton;
