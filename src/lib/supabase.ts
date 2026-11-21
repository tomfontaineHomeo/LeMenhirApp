import "server-only";
import { createClient } from "@supabase/supabase-js";

const PHOTOS_BUCKET = "photos";

function getAdminClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants. Voir .env.example.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export async function uploadStudentPhoto(
  fileName: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const supabase = getAdminClient();

  const { error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(fileName, buffer, { contentType, upsert: false });

  if (error) {
    throw new Error(`Échec de l'upload Supabase Storage : ${error.message}`);
  }

  const { data } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}
