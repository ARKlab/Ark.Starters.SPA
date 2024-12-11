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
  FormLabel,
  Input,
  Select,
  Spacer,
  Spinner,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import type { FormApi } from "final-form";
import { useEffect } from "react";
import { Field, Form } from "react-final-form";
import { useTranslation } from "react-i18next";
import { MdArrowDropDown } from "react-icons/md";
import * as z from "zod";

import { zod2FieldValidator } from "../../lib/zod2FormValidator";

import {
  useGetVideoGamesGenresQuery,
  useInsertNewVideoGameMutation,
} from "./videoGamesApiSlice";
import type { VideoGame } from "./videoGamesSampleDataAndTypes";

const stringValidator = z.string()
const yearValidator = z.string().refine(
  (value) => {
    const year = Number(value)
    return year > 1900 && year < 2022
  },
  { message: 'Year must be between 1900 and 2022' },
)
const ratingValidator = z.string().refine(
  (value) => {
    const rating = Number(value)
    return rating > 0 && rating < 10
  },
  { message: 'Rating must be from 0 to 10' },
)
const VideoGamesForm = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const [insertNewVideoGame, { isSuccess: insertSuccess }] =
    useInsertNewVideoGameMutation();

  const [flag, setFlag] = useBoolean()
  const { data: genres, isLoading: genreLoading } =
    useGetVideoGamesGenresQuery()

  const onSubmit = async (values: VideoGame, form: FormApi<VideoGame>) => {
    await insertNewVideoGame(values)
    //reset form would not set it at pristine status so it would also
    //trigger validation errors. restart set it as new and it's what we want here
    form.restart()
    setFlag.toggle()
  }
  useEffect(() => {
    if (insertSuccess) {
      toast({
        title: 'Inserted!',
        description: 'Game saved succsessfully',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  }, [insertSuccess, toast])
  return (
    <Accordion
      allowToggle
      index={flag ? 0 : -1}
      onChange={setFlag.toggle}
      my="30px"
    >
      <AccordionItem>
        <AccordionButton>{t("games_add_video_game")}</AccordionButton>
        <AccordionPanel pb={4}>
          <Form
            onSubmit={async (values: VideoGame, form: FormApi<VideoGame>) =>
              onSubmit(values, form)
            }
            render={({ handleSubmit, submitting }) => {
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
                              id="title"
                            >
                              <FormLabel>
                                {t("games_title_placeholder")}
                              </FormLabel>
                              <Input
                                {...input}
                                placeholder={t("games_title_placeholder")}
                              />
                              <FormErrorMessage>{error}</FormErrorMessage>
                            </FormControl>
                          )
                        }}
                      />
                      <Spacer height="20px" />
                      <Field
                        name="genre"
                        render={({ input }) => {
                          return (
                            <FormControl>
                              <Select
                                {...input}
                                icon={
                                  genreLoading ? (
                                    <Spinner data-role='spinner' />
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
                          )
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
                          )
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
                          )
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
                          )
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
                          )
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
                          )
                        }}
                      />
                      <Spacer height="20px" />
                      <Button
                        mt={4}
                        colorScheme="teal"
                        isLoading={submitting}
                        type="submit"
                      >
                        {t("games_save_button")}
                      </Button>
                    </Box>
                  </form>
                </Container>
              )
            }}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default VideoGamesForm
