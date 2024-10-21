import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Stack,
  Spinner,
  Image,
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useDisclosure,
  Grid,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@chakra-ui/react";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State for the new event form
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    location: "",
    categoryIds: [],
  });

  useEffect(() => {
    const fetchEventsAndCategories = async () => {
      try {
        const eventsResponse = await fetch("http://localhost:3000/events");
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
        setFilteredEvents(eventsData);

        const categoriesResponse = await fetch(
          "http://localhost:3000/categories"
        );
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchEventsAndCategories();
  }, []);

  // Handle form input change for adding new event
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  // Handle form submission for adding new event
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for required fields
    if (
      !newEvent.title ||
      !newEvent.description ||
      !newEvent.startTime ||
      !newEvent.endTime
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newEvent,
          categoryIds: newEvent.categoryIds.map((id) => Number(id)), // Convert category IDs to numbers
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add event");
      }

      // Fetch the updated events after adding a new one
      const eventsResponse = await fetch("http://localhost:3000/events");
      const eventsData = await eventsResponse.json();
      setEvents(eventsData);
      setFilteredEvents(eventsData);

      // Close the modal
      onClose();

      // Reset the form
      setNewEvent({
        title: "",
        description: "",
        image: "",
        startTime: "",
        endTime: "",
        location: "",
        categoryIds: [],
      });
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Error adding event. Please try again.");
    }
  };

  // Filter events by search query and selected category
  const filterEvents = (query, category) => {
    const filtered = events.filter((event) => {
      const matchesSearchQuery =
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase());

      const matchesCategory = category
        ? event.categoryIds.includes(Number(category))
        : true;

      return matchesSearchQuery && matchesCategory;
    });

    setFilteredEvents(filtered);
  };

  // Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Apply search and filter
    filterEvents(query, selectedCategory);
  };

  // Handle category filter change
  const handleCategoryFilter = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);

    // Apply search and filter
    filterEvents(searchQuery, selected);
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box p={4}>
      <Heading mb={8} textAlign="center">
        Upcoming Events
      </Heading>

      {/* Search and category filter */}
      <Box display="flex" justifyContent="space-between" mb={6}>
        <Input
          placeholder="Search for events..."
          value={searchQuery}
          onChange={handleSearch}
          maxW="300px"
        />
        <Select
          placeholder="Filter by category"
          value={selectedCategory}
          onChange={handleCategoryFilter}
          maxW="300px"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </Box>

      {/* Add Event Button */}
      <Button onClick={onOpen} colorScheme="teal" mb={8}>
        Add Event
      </Button>

      {/* Modal for adding a new event */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="add-event-form" onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Image URL</FormLabel>
                <Input
                  name="image"
                  value={newEvent.image}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Start Time</FormLabel>
                <Input
                  type="datetime-local"
                  name="startTime"
                  value={newEvent.startTime}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>End Time</FormLabel>
                <Input
                  type="datetime-local"
                  name="endTime"
                  value={newEvent.endTime}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Location</FormLabel>
                <Input
                  name="location"
                  value={newEvent.location}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Categories</FormLabel>
                <Select
                  name="categoryIds"
                  value={newEvent.categoryIds}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, categoryIds: [e.target.value] })
                  }
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" type="submit" form="add-event-form">
              Add Event
            </Button>
            <Button onClick={onClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Display filtered events */}
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Card
              key={event.id}
              shadow="md"
              borderWidth="1px"
              borderRadius="lg"
            >
              <CardHeader>
                <Image src={event.image} alt={event.title} borderRadius="lg" />
              </CardHeader>
              <CardBody>
                <Heading fontSize="xl" mb={2}>
                  {event.title}
                </Heading>
                <Text color="gray.600" mb={4}>
                  {event.description}
                </Text>

                {/* Display location */}
                <Text fontWeight="bold">Location: {event.location}</Text>

                <Stack direction="row" spacing={2} mt={2}>
                  {event.categoryIds.map((categoryId) => {
                    const category = categories.find(
                      (cat) => cat.id === categoryId
                    );
                    return (
                      <Badge key={categoryId} colorScheme="green">
                        {category?.name}
                      </Badge>
                    );
                  })}
                </Stack>
              </CardBody>
              <CardFooter>
                <Link to={`/event/${event.id}`}>
                  <Button colorScheme="teal" variant="outline">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Text>No events found.</Text>
        )}
      </Grid>
    </Box>
  );
};
