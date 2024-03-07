import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  Input,
  Select,
  Spacer,
  Spinner,
} from "@chakra-ui/react";
import { FormApi } from "final-form";
import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { MdArrowDropDown } from "react-icons/md";
import { z } from "zod";
import { useAppDispatch } from "../../app/hooks";
import { zod2FieldValidator } from "../../lib/zod2form";
import { dispatchNotification } from "../notifications/notification";
import { NotificationDuration } from "../notifications/notificationsTypes";
import {
  useGetVideoGamesGenresQuery,
  useInsertNewVideoGameMutation,
} from "./videoGamesApiSlice";
import { VideoGame } from "./videoGamesSampleDataAndTypes";
const stringValidator = z.string();
const yearValidator = z.string().refine(
  (value) => {
    const year = Number(value);
    return year > 1900 && year < 2022;
  },
  { message: "Year must be between 1900 and 2022" }
);
const ratingValidator = z.string().refine(
  (value) => {
    const rating = Number(value);
    return rating > 0 && rating < 10;
  },
  { message: "Rating must be from 0 to 10" }
);
const VideoGamesForm = () => {
  const dispatch = useAppDispatch();
  const [
    insertNewVideoGame,
    { isLoading: insertLoading, isSuccess: insertSuccess },
  ] = useInsertNewVideoGameMutation();

  const [isOpen, setIsOpen] = useState(false);
  const { data: genres, isLoading: genreLoading } =
    useGetVideoGamesGenresQuery();

  const onSubmit = async (values: VideoGame, form: FormApi<VideoGame>) => {
    await insertNewVideoGame(values);
    //reset form would not set it at pristine status so it would also
    //trigger validation errors. restart set it as new and it's what we want here
    form.restart();
    setIsOpen(false);
  };
  useEffect(() => {
    if (insertSuccess) {
      dispatch(
        dispatchNotification({
          id: "1",
          title: "Inserted!",
          message: "Game saved succsessfully",
          status: "success",
          duration: NotificationDuration.Medium,
          isClosable: true,
          position: "bottom-right",
        })
      );
    }
  }, [insertSuccess, dispatch]);

  return (
    <Accordion
      allowToggle
      index={isOpen ? 0 : -1}
      onChange={(index) => setIsOpen(index === 0)}
    >
      <AccordionItem>
        <AccordionButton>Add videoGame </AccordionButton>
        <AccordionPanel pb={4}>
          <Form
            onSubmit={(values: VideoGame, form: FormApi<VideoGame>) =>
              onSubmit(values, form)
            }
            render={({ handleSubmit, form, submitting }) => {
              return (
                <Container maxW="container.md">
                  <form onSubmit={handleSubmit}>
                    <Box mb={4}>
                      <Field
                        validate={zod2FieldValidator(stringValidator)}
                        name="title"
                        render={({ input, meta: { error, touched } }) => {
                          return (
                            <FormControl
                              isInvalid={error && touched}
                              isDisabled={submitting}
                            >
                              <Input
                                {...input}
                                type="text"
                                placeholder="Title"
                              />
                              <FormErrorMessage>{error}</FormErrorMessage>
                            </FormControl>
                          );
                        }}
                      />
                      <Spacer height="20px" />
                      <Field
                        name="genre"
                        render={({ input, meta: { error, touched } }) => {
                          error = error;
                          return (
                            <FormControl>
                              <Select
                                {...input}
                                icon={
                                  genreLoading ? (
                                    <Spinner />
                                  ) : (
                                    <MdArrowDropDown />
                                  )
                                }
                              >
                                {genres?.map((genre) => (
                                  <option key={genre.id} value={genre.name}>
                                    {genre.name}
                                  </option>
                                ))}
                              </Select>
                            </FormControl>
                          );
                        }}
                      />
                      <Spacer height="20px" />
                      <Field
                        name="releaseYear"
                        validate={zod2FieldValidator(yearValidator)}
                        render={({ input, meta: { error, touched } }) => {
                          return (
                            <FormControl
                              isInvalid={error && touched}
                              isDisabled={submitting}
                            >
                              <Input
                                {...input}
                                type="text"
                                placeholder="Release Year"
                              />
                              <FormErrorMessage>{error}</FormErrorMessage>
                            </FormControl>
                          );
                        }}
                      />
                      <Spacer height="20px" />
                      <Field
                        name="developer"
                        validate={zod2FieldValidator(stringValidator)}
                        render={({ input, meta: { error, touched } }) => {
                          return (
                            <FormControl
                              isInvalid={error && touched}
                              isDisabled={submitting}
                            >
                              <Input
                                {...input}
                                type="text"
                                placeholder="Developer"
                              />
                              <FormErrorMessage>{error}</FormErrorMessage>
                            </FormControl>
                          );
                        }}
                      />
                      <Spacer height="20px" />
                      <Field
                        name="platform"
                        validate={zod2FieldValidator(stringValidator)}
                        render={({ input, meta: { error, touched } }) => {
                          return (
                            <FormControl
                              isInvalid={error && touched}
                              isDisabled={submitting}
                            >
                              <Input
                                {...input}
                                type="text"
                                placeholder="System"
                              />
                              <FormErrorMessage>{error}</FormErrorMessage>
                            </FormControl>
                          );
                        }}
                      />
                      <Spacer height="20px" />
                      <Field
                        name="rating"
                        validate={zod2FieldValidator(ratingValidator)}
                        render={({ input, meta: { error, touched } }) => {
                          return (
                            <FormControl
                              isInvalid={error && touched}
                              isDisabled={submitting}
                            >
                              <Input
                                {...input}
                                type="text"
                                placeholder="Rating"
                              />
                              <FormErrorMessage>{error}</FormErrorMessage>
                            </FormControl>
                          );
                        }}
                      />
                      <Spacer height="20px" />
                      <Field
                        name="sells"
                        validate={zod2FieldValidator(stringValidator)}
                        render={({ input, meta: { error, touched } }) => {
                          return (
                            <FormControl
                              isInvalid={error && touched}
                              isDisabled={submitting}
                            >
                              <Input
                                {...input}
                                type="text"
                                placeholder="Sells (Millions)"
                              />
                              <FormErrorMessage>{error}</FormErrorMessage>
                            </FormControl>
                          );
                        }}
                      />
                      <Spacer height="20px" />
                      <Button
                        type="submit"
                        colorScheme="teal"
                        isLoading={submitting}
                      >
                        Save
                      </Button>
                    </Box>
                  </form>
                </Container>
              );
            }}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default VideoGamesForm;
