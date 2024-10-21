import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Flex, Container, Text } from "@chakra-ui/react";
import { Navigation } from "./Navigation";

export const Root = () => {
  return (
    <Flex direction="column" minHeight="100vh">
      {/* Navigation Bar (Header) */}
      <Navigation />

      {/* Main Content Area */}
      <Box as="main" flex="1" py={8}>
        <Container maxW="container.lg">
          <Outlet /> {/* Render child routes like EventsPage or EventPage */}
        </Container>
      </Box>

      {/* Footer */}
      <Box as="footer" bg="gray.800" color="white" py={4}>
        <Container maxW="container.lg">
          <Text textAlign="center">
            © 2024 Event Dashboard App. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Flex>
  );
};
