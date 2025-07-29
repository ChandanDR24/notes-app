// src/pages/Login.tsx
import {
  Box,
  Flex,
  Image,
  Stack,
  Text,
  useBreakpointValue,
  Link,
} from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu"
import OTPForm from "../components/OTPForm";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Login = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      minH="100vh"
      direction={{ base: "column", md: "row" }}
      bg="white"
      color="black"
      px={{ base: 4, md: 0 }}
      py={{ base: 8, md: 0 }}
    >
      {/* Form Panel */}
      <Flex
        flex="1"
        direction="column"
        justify="center"
        align="center"
        px={{ base: 2, sm: 6, md: 12 }}
        py={{ base: 4, md: 0 }}
      >
        <Box w="full" maxW="md">
          {/* Header (Logo + Brand) */}
          <Flex align="center"  mb={8}>
            <Image src="/logo.png" alt="Logo" boxSize="40px" mr={2} />
            <Text fontSize="40px" fontWeight="semibold">
              HD
            </Text>
          </Flex>
          {/* Form */}
          <Stack>
            <OTPForm />
            {/* Divider */}
            <Flex align="center" gap={3} my={2}>
              <Box flex="1" h="1px" bg="gray.200" />
              <Text fontSize="sm" color="gray.400">
                OR
              </Text>
              <Box flex="1" h="1px" bg="gray.200" />
            </Flex>

            <GoogleLoginButton />
          </Stack>
          <Box flex="1" mt={4}>
          <Link href="https://github.com/ChandanDR24/notes-app/" color="black">
            GitHub<LuExternalLink />
          </Link>
          </Box>
        </Box>
      </Flex>

      {/* Right Panel image only on desktop */}
      {!isMobile && (
        <Box flex="1" display={{ base: "none", md: "block" }}>
          <Image
            src="/login.jpg"
            alt="Login Background"
            objectFit="cover"
            w="100%"
            h="100vh"
          />
        </Box>
      )}
    </Flex>
  );
};

export default Login;
