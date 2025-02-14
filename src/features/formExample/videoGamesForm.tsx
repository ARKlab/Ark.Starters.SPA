import { Box, Button, Container, Field, FieldLabel, Input, Spacer, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MdArrowDropDown } from "react-icons/md";
import * as z from "zod";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "../../components/ui/accordion";
import { NativeSelectField, NativeSelectRoot } from "../../components/ui/native-select";
import { Toaster, toaster } from "../../components/ui/toaster";

import { useGetVideoGamesGenresQuery, useInsertNewVideoGameMutation } from "./videoGamesApiSlice";
import type { VideoGame } from "./videoGamesSampleDataAndTypes";

const yearValidator = z.string().refine(
  value => {
    const year = Number(value);
    return year > 1900 && year < 2022;
  },
  { message: "Year must be between 1900 and 2022" },
);
const ratingValidator = z.string().refine(
  value => {
    const rating = Number(value);
    return rating > 0 && rating < 10;
  },
  { message: "Rating must be from 0 to 10" },
);

function VideoGamesForm() {
  const { t } = useTranslation();

  const [insertNewVideoGame, { isSuccess: insertSuccess }] = useInsertNewVideoGameMutation();

  const [flag, setFlag] = useState(false);
  const { data: genres, isLoading: genreLoading } = useGetVideoGamesGenresQuery();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VideoGame>();

  async function onSubmit(values: VideoGame) {
    await insertNewVideoGame(values);
    reset();
    setFlag(!flag);
  }

  useEffect(() => {
    if (insertSuccess) {
      toaster.create({
        title: "Inserted!",
        description: "Game saved successfully",
        duration: 4000,
        type: "success",
      });
    }
  }, [insertSuccess]);

  return (
    <>
      <AccordionRoot
        collapsible
        multiple
        onChange={() => {
          setFlag(!flag);
        }}
        my="30px"
      >
        <AccordionItem value="addVideoGame">
          <AccordionItemTrigger>{t("games_add_video_game")}</AccordionItemTrigger>
          <AccordionItemContent pb={4}>
            <Container maxW="container.md">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box mb={4}>
                  <Field.Root invalid={!!errors.title} id="title">
                    <FieldLabel>{t("games_title_placeholder")}</FieldLabel>
                    <Controller
                      name="title"
                      control={control}
                      rules={{ required: "Title is required" }}
                      render={({ field }) => <Input {...field} placeholder={t("games_title_placeholder")} />}
                    />
                    <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                  </Field.Root>

                  <Spacer height="20px" />

                  <Field.Root>
                    <FieldLabel>{t("games_genre_placeholder")}</FieldLabel>
                    <Controller
                      name="genre"
                      control={control}
                      render={({ field }) => (
                        <NativeSelectRoot
                          {...field}
                          icon={genreLoading ? <Spinner data-role="spinner" /> : <MdArrowDropDown />}
                        >
                          <NativeSelectField>
                            {genres?.map(genre => (
                              <option key={genre.id} value={genre.name}>
                                {genre.name}
                              </option>
                            ))}
                          </NativeSelectField>
                        </NativeSelectRoot>
                      )}
                    />
                  </Field.Root>

                  <Spacer height="20px" />

                  <Field.Root invalid={!!errors.releaseYear}>
                    <FieldLabel>Release Year</FieldLabel>
                    <Controller
                      name="releaseYear"
                      control={control}
                      rules={{
                        validate: value => yearValidator.safeParse(value).success || "Invalid year",
                      }}
                      render={({ field }) => <Input {...field} placeholder="Release Year" />}
                    />
                    <Field.ErrorText>{errors.releaseYear?.message}</Field.ErrorText>
                  </Field.Root>

                  <Spacer height="20px" />

                  <Field.Root invalid={!!errors.developer}>
                    <FieldLabel>Developer</FieldLabel>
                    <Controller
                      name="developer"
                      control={control}
                      rules={{ required: "Developer is required" }}
                      render={({ field }) => <Input {...field} placeholder="Developer" />}
                    />
                    <Field.ErrorText>{errors.developer?.message}</Field.ErrorText>
                  </Field.Root>

                  <Spacer height="20px" />

                  <Field.Root invalid={!!errors.platform}>
                    <FieldLabel>System</FieldLabel>
                    <Controller
                      name="platform"
                      control={control}
                      rules={{ required: "Platform is required" }}
                      render={({ field }) => <Input {...field} placeholder="System" />}
                    />
                    <Field.ErrorText>{errors.platform?.message}</Field.ErrorText>
                  </Field.Root>

                  <Spacer height="20px" />

                  <Field.Root invalid={!!errors.rating}>
                    <FieldLabel>Rating</FieldLabel>
                    <Controller
                      name="rating"
                      control={control}
                      rules={{
                        validate: value => ratingValidator.safeParse(value).success || "Invalid rating",
                      }}
                      render={({ field }) => <Input {...field} placeholder="Rating" />}
                    />
                    <Field.ErrorText>{errors.rating?.message}</Field.ErrorText>
                  </Field.Root>

                  <Spacer height="20px" />

                  <Field.Root invalid={!!errors.salesMillions}>
                    <FieldLabel>Sells (Millions)</FieldLabel>
                    <Controller
                      name="salesMillions"
                      control={control}
                      rules={{ required: "Sells are required" }}
                      render={({ field }) => <Input {...field} placeholder="Sells (Millions)" />}
                    />
                    <Field.ErrorText>{errors.salesMillions?.message}</Field.ErrorText>
                  </Field.Root>

                  <Spacer height="20px" />

                  <Button mt={4} colorPalette="primaryPalette" loading={isSubmitting} type="submit">
                    {t("games_save_button")}
                  </Button>
                </Box>
              </form>
            </Container>
          </AccordionItemContent>
        </AccordionItem>
      </AccordionRoot>
      <Toaster />
    </>
  );
}

export default VideoGamesForm;
