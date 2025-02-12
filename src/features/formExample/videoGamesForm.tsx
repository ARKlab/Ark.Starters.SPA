import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  Container,
  Field,
  Input,
  Select,
  Spacer,
  Spinner,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MdArrowDropDown } from "react-icons/md";
import * as z from "zod";

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
  const toast = useToast();

  const [insertNewVideoGame, { isSuccess: insertSuccess }] = useInsertNewVideoGameMutation();

  const [flag, setFlag] = useBoolean();
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
    setFlag.toggle();
  }

  useEffect(() => {
    if (insertSuccess) {
      toast({
        title: "Inserted!",
        description: "Game saved successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  }, [insertSuccess, toast]);

  return (
    <Accordion allowToggle index={flag ? 0 : -1} onChange={setFlag.toggle} my="30px">
      <AccordionItem>
        <AccordionButton>{t("games_add_video_game")}</AccordionButton>
        <AccordionPanel pb={4}>
          <Container maxW="container.md">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box mb={4}>
                <Field.Root invalid={!!errors.title} id="title">
                  <FormLabel>{t("games_title_placeholder")}</FormLabel>
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
                  <FormLabel>{t("games_genre_placeholder")}</FormLabel>
                  <Controller
                    name="genre"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} icon={genreLoading ? <Spinner data-role="spinner" /> : <MdArrowDropDown />}>
                        {genres?.map(genre => (
                          <option key={genre.id} value={genre.name}>
                            {genre.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                </Field.Root>

                <Spacer height="20px" />

                <Field.Root invalid={!!errors.releaseYear}>
                  <FormLabel>Release Year</FormLabel>
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
                  <FormLabel>Developer</FormLabel>
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
                  <FormLabel>System</FormLabel>
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
                  <FormLabel>Rating</FormLabel>
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
                  <FormLabel>Sells (Millions)</FormLabel>
                  <Controller
                    name="salesMillions"
                    control={control}
                    rules={{ required: "Sells are required" }}
                    render={({ field }) => <Input {...field} placeholder="Sells (Millions)" />}
                  />
                  <Field.ErrorText>{errors.salesMillions?.message}</Field.ErrorText>
                </Field.Root>

                <Spacer height="20px" />

                <Button mt={4} colorPalette="teal" isLoading={isSubmitting} type="submit">
                  {t("games_save_button")}
                </Button>
              </Box>
            </form>
          </Container>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export default VideoGamesForm;
