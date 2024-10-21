import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Flex, Button, Spacer } from "@chakra-ui/react";

export const Navigation = () => {
  const location = useLocation(); // Get the current route

  // Conditionally show the "Back to Events" button only if on an event page
  const showBackToEventsButton = location.pathname.startsWith("/event/");

  return (
    <Box bg="gray.100" p={4}>
      <Flex justifyContent="space-between" alignItems="center">
        {showBackToEventsButton && (
          <Link to="/">
            <Button colorScheme="teal" variant="outline">
              Back to Events
            </Button>
          </Link>
        )}

        <Spacer />

        {/* You can add other navigation links here if needed */}
      </Flex>
    </Box>
  );
};
