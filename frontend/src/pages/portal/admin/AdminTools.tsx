import { useState } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminTools() {
    const [columns, setColumns] = useState<{ key: string; header: string; sortable: boolean }[]>([
        { key: "id", header: "ID", sortable: true },
        { key: "name", header: "Name", sortable: true },
        { key: "role", header: "Role", sortable: true },
        { key: "status", header: "Status", sortable: false },
    ]);

    const [data, setData] = useState<any[]>([
        { id: "1", name: "John Doe", role: "Admin", status: "Active" },
        { id: "2", name: "Jane Smith", role: "User", status: "Inactive" },
        { id: "3", name: "Bob Johnson", role: "User", status: "Active" },
    ]);

    const [newColumn, setNewColumn] = useState({ key: "", header: "" });
    const [newData, setNewData] = useState<any>({});

    const addColumn = () => {
        if (!newColumn.key || !newColumn.header) return;
        setColumns([...columns, { ...newColumn, sortable: true }]);
        setNewColumn({ key: "", header: "" });
    };

    const removeColumn = (key: string) => {
        setColumns(columns.filter(c => c.key !== key));
    };

    const addRow = () => {
        setData([...data, { ...newData, id: (data.length + 1).toString() }]);
        setNewData({});
        toast.success("Row added to preview");
    };

    return (
        <PortalLayout>
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="font-heading text-2xl lg:text-3xl font-medium text-foreground">
                        Toolbox: Table Creator
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Build and preview dynamic tables efficiently.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Configuration</CardTitle>
                                <CardDescription>Define your table structure</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Add Column</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Key (e.g. firstName)"
                                            value={newColumn.key}
                                            onChange={(e) => setNewColumn({ ...newColumn, key: e.target.value })}
                                        />
                                        <Input
                                            placeholder="Header"
                                            value={newColumn.header}
                                            onChange={(e) => setNewColumn({ ...newColumn, header: e.target.value })}
                                        />
                                    </div>
                                    <Button onClick={addColumn} className="w-full" variant="outline" size="sm">
                                        <Plus className="w-4 h-4 mr-2" /> Add Column
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <Label>Current Columns</Label>
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                                        {columns.map((col) => (
                                            <div key={col.key} className="flex items-center justify-between p-2 rounded bg-muted/50 border text-sm">
                                                <span>{col.header} <span className="text-muted-foreground font-mono text-xs">({col.key})</span></span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeColumn(col.key)}>
                                                    <Trash2 className="w-3 h-3 text-destructive" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <Label className="mb-2 block">Add Sample Data</Label>
                                    <div className="space-y-2">
                                        {columns.map((col) => (
                                            <Input
                                                key={col.key}
                                                placeholder={col.header}
                                                value={newData[col.key] || ""}
                                                onChange={(e) => setNewData({ ...newData, [col.key]: e.target.value })}
                                            />
                                        ))}
                                        <Button onClick={addRow} className="w-full" variant="gold" size="sm">
                                            Add Data Row
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Live Preview</CardTitle>
                                <CardDescription>How the table looks with current config</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    title="Preview Table"
                                    description="This is a generated preview of your table configuration."
                                    columns={columns}
                                    data={data}
                                    onEdit={(item) => toast.info(`Edit item: ${item.id}`)}
                                    onDelete={(item) => toast.info(`Delete item: ${item.id}`)}
                                    searchKey={columns[1]?.key || "id"}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
