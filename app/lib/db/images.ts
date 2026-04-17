import { supabase } from "@/app/lib/supabase";

export async function deleteEventImages(imageUrls: string[]): Promise<void> {
  if (imageUrls.length === 0) return;

  const bucketPrefix = "/storage/v1/object/public/event-images/";
  const paths = imageUrls.map((url) => {
    const idx = url.indexOf(bucketPrefix);
    if (idx === -1) throw new Error(`Unrecognised image URL: ${url}`);
    return url.slice(idx + bucketPrefix.length);
  });

  const { error: storageError } = await supabase.storage
    .from("event-images")
    .remove(paths);
  if (storageError) {
    console.error("[delete-event-images] storage error:", storageError);
    throw storageError;
  }

  const { error: dbError } = await supabase
    .from("event_images")
    .delete()
    .in("image_url", imageUrls);
  if (dbError) {
    console.error("[delete-event-images] db error:", dbError);
    throw dbError;
  }
}

export async function uploadEventImages(
  eventId: string,
  files: File[]
): Promise<string[]> {
  // Upload all files in parallel
  const urls = await Promise.all(
    files.map(async (file) => {
      const path = `${eventId}/${Date.now()}-${file.name}`;
      console.log("Uploading image:", path);

      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(path, file);

      if (uploadError) throw uploadError;

      const url = supabase.storage.from("event-images").getPublicUrl(path).data.publicUrl;
      console.log("Public URL:", url);
      return url;
    })
  );

  // Batch insert all image rows in one query
  const { error: insertError } = await supabase
    .from("event_images")
    .insert(urls.map((image_url) => ({ event_id: eventId, image_url })));

  if (insertError) throw insertError;

  return urls;
}
