import { supabase } from "@/app/lib/supabase";

export async function uploadEventImages(
  eventId: string,
  files: File[]
): Promise<string[]> {
  // Upload all files in parallel
  const urls = await Promise.all(
    files.map(async (file) => {
      const path = `${eventId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(path, file);

      if (uploadError) throw uploadError;

      return supabase.storage.from("event-images").getPublicUrl(path).data.publicUrl;
    })
  );

  // Batch insert all image rows in one query
  const { error: insertError } = await supabase
    .from("event_images")
    .insert(urls.map((image_url) => ({ event_id: eventId, image_url })));

  if (insertError) throw insertError;

  return urls;
}
