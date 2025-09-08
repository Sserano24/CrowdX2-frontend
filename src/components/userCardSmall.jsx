import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderKanban } from "lucide-react";

export default function SpotlightUsers({ users }) {
  return (
    <CardContent className="grid sm:grid-cols-2 gap-4">
      {users.map((u) => (
        <div key={u.id} className="p-4 rounded-xl border">
          {/* Header with profile picture + name */}
          <div className="flex items-center gap-3">
            <img
              src={u.profile_picture}
              alt={u.name}
              className="size-12 rounded-full object-cover"
            />
            <div>
              <div className="font-medium">{u.name}</div>
            </div>
          </div>

          {/* Blurb */}
          <div className="mt-3 text-sm text-muted-foreground">
            {u.blurb ? u.blurb : "No description provided."}
          </div>

          {/* Associated Projects */}
            <div className="mt-3 text-sm">
            <div className="flex items-center gap-2 mb-1">
                <FolderKanban className="w-4 h-4 text-primary" />
                <span className="font-medium">Projects:</span>
            </div>

            {Array.isArray(u.associated_projects) && u.associated_projects.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 mt-1">
                {u.associated_projects.slice(0, 2).map((proj) => (
                    <Badge
                    key={proj.id}
                    variant="outline"
                    className="w-full justify-center rounded-full text-xs px-2 py-1"
                    >
                    {proj.title}
                    </Badge>
                ))}
                </div>
            ) : (
                <span className="text-xs text-muted-foreground">
                No associated projects
                </span>
            )}
            </div>

        </div>
      ))}
    </CardContent>
  );
}
