import { useMemo, useState } from "react";
import { FileUp, Loader2, Trash2 } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import {
  useDeletePlanContext,
  usePlanContexts,
  useSetPlanContextActive,
  useUploadPlanContext,
} from "../../api/hooks";

export default function PlanContextsPage() {
  const { data: contexts = [], isLoading } = usePlanContexts();
  const uploadMutation = useUploadPlanContext();
  const setActiveMutation = useSetPlanContextActive();
  const deleteMutation = useDeletePlanContext();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const activeCount = useMemo(() => contexts.filter((context) => context.active).length, [contexts]);

  const handleUpload = () => {
    if (!title.trim() || !file) return;
    uploadMutation.mutate(
      { title: title.trim(), file },
      {
        onSuccess: () => {
          setTitle("");
          setFile(null);
        },
      },
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Plan generation context"
        description="Primary admin workspace for plan quality: upload PDF or text references, which are synthesized and injected into prompts when users generate plans from the app."
      />

      <section className="bg-white border border-border-light/50 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-heading">Upload New Context</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Context title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="md:col-span-2 px-3 py-2 bg-button-secondary border border-border-light rounded-xl text-sm text-heading"
          />
          <label className="px-3 py-2 bg-button-secondary border border-border-light rounded-xl text-sm text-body flex items-center gap-2 cursor-pointer">
            <FileUp className="w-4 h-4" />
            <span>{file ? file.name : "Choose file (.txt/.pdf)"}</span>
            <input
              type="file"
              accept=".txt,.pdf,text/plain,application/pdf"
              className="hidden"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>
        </div>
        <button
          type="button"
          onClick={handleUpload}
          disabled={!title.trim() || !file || uploadMutation.isPending}
          className="px-4 py-2 rounded-xl bg-dark text-white text-sm font-medium disabled:opacity-50"
        >
          {uploadMutation.isPending ? "Uploading..." : "Upload Context"}
        </button>
      </section>

      <section className="bg-white border border-border-light/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-heading">
            Saved Contexts ({activeCount} active / {contexts.length} total)
          </h2>
          {(isLoading || setActiveMutation.isPending || deleteMutation.isPending) && (
            <Loader2 className="w-4 h-4 animate-spin text-accent" />
          )}
        </div>

        <div className="space-y-3">
          {contexts.map((context) => (
            <article
              key={context.id}
              className="border border-border-light rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-heading">{context.title}</p>
                  <p className="text-xs text-muted">
                    {context.fileName} · {context.sourceType.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMutation.mutate({ id: context.id, active: !context.active })
                    }
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      context.active ? "bg-success/10 text-success" : "bg-button-secondary text-muted"
                    }`}
                  >
                    {context.active ? "Active" : "Inactive"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(context.id)}
                    className="p-2 rounded-lg text-muted hover:text-danger hover:bg-danger/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-body whitespace-pre-wrap">
                {context.synthesizedText || "No synthesized text available."}
              </p>
            </article>
          ))}

          {!isLoading && contexts.length === 0 && (
            <p className="text-sm text-muted">No context files uploaded yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
