/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Image,
  Spinner,
  Badge,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Divider,
  Flex,
} from "@chakra-ui/react";

export const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [creator, setCreator] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const cancelRef = useRef();

  const [editedEvent, setEditedEvent] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    location: "",
    categoryIds: [],
  });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventResponse = await fetch(
          `http://localhost:3000/events/${eventId}`
        );
        const eventData = await eventResponse.json();
        setEvent(eventData);
        setEditedEvent(eventData);

        const categoriesResponse = await fetch(
          "http://localhost:3000/categories"
        );
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        const creatorResponse = await fetch(
          `http://localhost:3000/users/${eventData.createdBy}`
        );
        const creatorData = await creatorResponse.json();
        setCreator(creatorData);

        setLoading(false);
      } catch (error) {
        setError("Failed to load event details");
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  const getCategoryNames = (categoryIds) => {
    return categoryIds.map((id) => {
      const category = categories.find((cat) => Number(cat.id) === Number(id));
      return category ? category.name : "Unknown";
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent({
      ...editedEvent,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedEvent),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      setIsEditing(false);

      toast({
        title: "Event updated.",
        description: "The event was successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setError("Failed to update event");

      toast({
        title: "Error updating event.",
        description: "There was a problem updating the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      toast({
        title: "Event deleted.",
        description: "The event has been successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Error deleting event.",
        description: "There was a problem deleting the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  if (!event) {
    return <Text>Event not found</Text>;
  }

  return (
    <Box
      p={8}
      maxW="container.lg"
      mx="auto"
      boxShadow="lg"
      borderRadius="lg"
      bg="white"
    >
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={editedEvent.title}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={editedEvent.description}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Image URL</FormLabel>
            <Input
              name="image"
              value={editedEvent.image}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Start Time</FormLabel>
            <Input
              type="datetime-local"
              name="startTime"
              value={editedEvent.startTime}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>End Time</FormLabel>
            <Input
              type="datetime-local"
              name="endTime"
              value={editedEvent.endTime}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Location</FormLabel>
            <Input
              name="location"
              value={editedEvent.location}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Categories</FormLabel>
            <Select
              name="categoryIds"
              value={editedEvent.categoryIds}
              onChange={(e) =>
                setEditedEvent({
                  ...editedEvent,
                  categoryIds: [e.target.value],
                })
              }
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <Button mt={6} colorScheme="teal" type="submit">
            Save Changes
          </Button>
          <Button mt={6} ml={3} onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </form>
      ) : (
        <Flex direction={{ base: "column", md: "row" }} gap={8}>
          {/* Event Image */}
          <Box flex="1">
            <Image
              src={event.image}
              alt={event.title}
              borderRadius="md"
              mb={4}
              w="100%"
            />
          </Box>

          {/* Event Details */}
          <Box flex="2">
            <Heading mb={4}>{event.title}</Heading>
            <Text mb={4}>{event.description}</Text>

            <Text mb={4} color="gray.500">
              Starts: {new Date(event.startTime).toLocaleString()} - Ends:{" "}
              {new Date(event.endTime).toLocaleString()}
            </Text>

            <Divider my={6} />

            {/* Categories */}
            <Stack direction="row" mt={4}>
              {getCategoryNames(event.categoryIds).map((category, index) => (
                <Badge key={index} colorScheme="green">
                  {category}
                </Badge>
              ))}
            </Stack>

            {/* Creator Information */}
            {creator && (
              <Box mt={6}>
                <Heading fontSize="lg">Created by:</Heading>
                <Stack direction="row" align="center" mt={2}>
                  <Image
                    src={creator.image}
                    alt={creator.name}
                    boxSize="50px"
                    borderRadius="full"
                  />
                  <Text fontSize="lg">{creator.name}</Text>
                </Stack>
              </Box>
            )}

            {/* Action Buttons */}
            <Button
              mt={6}
              colorScheme="blue"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>

            <Button mt={6} colorScheme="red" ml={3} onClick={openDeleteDialog}>
              Delete
            </Button>

            <AlertDialog
              isOpen={isDeleteDialogOpen}
              leastDestructiveRef={cancelRef}
              onClose={closeDeleteDialog}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete Event
                  </AlertDialogHeader>
                  <AlertDialogBody>
                    Are you sure? You can't undo this action.
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={closeDeleteDialog}>
                      Cancel
                    </Button>
                    <Button colorScheme="red" onClick={handleDelete} ml={3}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Box>
        </Flex>
      )}
    </Box>
  );
};
