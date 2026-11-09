import { unzipSync } from 'fflate';

export async function readJsonFilesFromZip(
  file: File,
): Promise<Array<{ name: string; content: string }>> {
  const archive = unzipSync(new Uint8Array(await file.arrayBuffer()));
  return Object.entries(archive)
    .filter(([path]) =>
      path.toLowerCase().endsWith('.json') &&
      !path.split('/').some((segment) => segment.startsWith('__')),
    )
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([path, contents]) => ({
      name: path,
      content: new TextDecoder().decode(contents),
    }));
}
