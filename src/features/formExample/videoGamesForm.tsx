import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
  Box,
  Container,
  FieldRoot,
  Input,
  NativeSelectRoot,
  Spacer,
  Spinner,
} from "@chakra-ui/react";
import type { FormApi } from "final-form";
import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { useTranslation } from "react-i18next";
import { MdArrowDropDown } from "react-icons/md";
import * as z from "zod";

import { Button } from "../../components/ui/button";
import { Field as FormField } from "../../components/ui/field";
import { Toaster } from "../../components/ui/toaster";
import { toaster } from "../../components/ui/toaster-helper";
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
  const toast = Toaster();

  const [insertNewVideoGame, { isSuccess: insertSuccess }] =
    useInsertNewVideoGameMutation();

  const [flag, setFlag] = useState(false)
  const { data: genres, isLoading: genreLoading } =
    useGetVideoGamesGenresQuery()

  const onSubmit = async (values: VideoGame, form: FormApi<VideoGame>) => {
    await insertNewVideoGame(values)
    //reset form would not set it at pristine status so it would also
    //trigger validation errors. restart set it as new and it's what we want here
    form.restart()
    setFlag(flag => !flag);
  }
  useEffect(() => {
    if (insertSuccess) {
      toaster.create({
        title: 'Inserted!',
        description: 'Game saved succsessfully',
        type: 'success',
        duration: 4000,
        placement: 'bottom-end',
      });
    }
  }, [insertSuccess, toast])
  return (
    <AccordionRoot
      defaultValue={flag ? ["game"] : undefined}
      onValueChange={value => {
        setFlag(Array.isArray(value) && value.includes("game"));
      }}
      my="30px"
    >
      <AccordionItem value="game">
        <AccordionItemTrigger>{t("games_add_video_game")}</AccordionItemTrigger>
        <AccordionItemContent pb={4}>
          <Form
              onSubmit={async (values: VideoGame, form: FormApi<VideoGame>) => onSubmit(values, form)}
              render={({ handleSubmit, submitting }) => (
                <Container maxW="container.md">
                  <form onSubmit={handleSubmit}>
                    <Box mb={4}>
                      <Field
                        validate={zod2FieldValidator(stringValidator)}
                        name="title"
                        render={({ input, meta: { error, touched } }) => (
                          <FormField
                            invalid={error && touched}
                            errorText={error}
                            id="title"
                            title={t("games_title_placeholder")}
                          >
                            <Input {...input} placeholder={t("games_title_placeholder")} />
                          </FormField>
                        )}
                      />
                      <Spacer height="20px" />
                      <Field
                        name="genre"
                        render={({ input }) => {
                          return (
                            <FieldRoot>
                              <NativeSelectRoot
                                {...genreLoading ? <Spinner data-role="spinner" /> : <MdArrowDropDown />}
                                {...input}
                              >
                                {genres?.map(genre => (
                                  <option key={genre.id} value={genre.name}>
                                    {genre.name}
                                  </option>
                                ))}
                              </NativeSelectRoot>
                            </FieldRoot>
                          );
                        }}
                      />
                      <Spacer height="20px" />
                      <Field
                        name="releaseYear"
                        validate={zod2FieldValidator(yearValidator)}
                        render={({ input, meta: { error, touched } }) => (
                          <FormField invalid={error && touched} disabled={submitting} errorText={error}>
                            <Input {...input} type="text" placeholder="Release Year" />
                          </FormField>
                        )}
                      />
                      <Spacer height="20px" />
                      <Field
                        name="developer"
                        validate={zod2FieldValidator(stringValidator)}
                        render={({ input, meta: { error, touched } }) => (
                          <FormField invalid={error && touched} disabled={submitting} errorText={error}>
                            <Input {...input} type="text" placeholder="Developer" />
                          </FormField>
                        )}
                      />
                      <Spacer height="20px" />
                      <Field
                        name="platform"
                        validate={zod2FieldValidator(stringValidator)}
                        render={({ input, meta: { error, touched } }) => (
                          <FormField invalid={error && touched} disabled={submitting} errorText={error}>
                            <Input {...input} type="text" placeholder="System" />
                          </FormField>
                        )}
                      />
                      <Spacer height="20px" />
                      <Field
                        name="rating"
                        validate={zod2FieldValidator(ratingValidator)}
                        render={({ input, meta: { error, touched } }) => (
                          <FormField invalid={error && touched} disabled={submitting} errorText={error}>
                            <Input {...input} type="text" placeholder="Rating" />
                          </FormField>
                        )}
                      />
                      <Spacer height="20px" />
                      <Field
                        name="sells"
                        validate={zod2FieldValidator(stringValidator)}
                        render={({ input, meta: { error, touched } }) => (
                          <FormField invalid={error && touched} disabled={submitting} errorText={error}>
                            <Input {...input} type="text" placeholder="Sells (Millions)" />
                          </FormField>
                        )}
                      />
                      <Spacer height="20px" />
                      <Button mt={4} colorScheme="teal" loading={submitting} type="submit">
                        {t("games_save_button")}
                      </Button>
                    </Box>
                  </form>
              </Container>
            )}
          />
        </AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

export default VideoGamesForm
