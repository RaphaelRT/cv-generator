"use client";

import { SetStateAction, useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  PaginationState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, ArrowUpDown, Trash, Ellipsis } from "lucide-react";

type Offer = {
  id: number;
  created_at: string;
  updated_at: string;
  posted_at: string;
  company: string;
  link: string;
  content: string;
  recommendations: string;
  cv_name?: string;
  cv_link?: string;
  job_title: string;
  company_description: string;
};

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"created_at" | "posted_at" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetch("/api/offers")
      .then((res) => res.json())
      .then(setOffers);
  }, []);

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) =>
      Object.values(offer)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [offers, searchTerm]);

  const sortedOffers = useMemo(() => {
    if (!sortBy) return filteredOffers;
    return [...filteredOffers].sort((a, b) => {
      const dateA = new Date(a[sortBy]).getTime();
      const dateB = new Date(b[sortBy]).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [filteredOffers, sortBy, sortOrder]);

  const toggleSort = (column: "created_at" | "posted_at") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleDeleteOffer = (offer: Offer) => {
    fetch(`/api/offers/${offer.id}`, { method: "DELETE" })
      .then(() => setOffers(offers.filter((o) => o.id !== offer.id)))
      .then(() => setSelectedOffer(null));
  };

  return (
    <div className="flex w-screen h-screen p-[2rem]">
      <div className="w-1/2 pr-[2rem]"> 
        <div className="pb-4 flex items-center justify-between">
          <Input
            type="text"
            placeholder="Rechercher dans toutes les colonnes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3"
          />
        </div>
        <div className="overflow-hidden border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Poste</TableHead>
                <TableHead>Entreprise</TableHead>
                <TableHead onClick={() => toggleSort("posted_at")} className="cursor-pointer flex items-center gap-1">Date de publication <ArrowUpDown /></TableHead>
                <TableHead>CV</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOffers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>{offer.job_title}</TableCell>
                  <TableCell>{offer.company}</TableCell>
                  <TableCell>{new Date(offer.posted_at).toLocaleDateString()}</TableCell>
                  <TableCell>{offer.cv_link ? <a href={offer.cv_link} className="text-blue-600" target="_blank">Télécharger</a> : "-"}</TableCell>
                  <TableCell>{new Date(offer.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <RowActions offer={offer} setSelectedOffer={setSelectedOffer} handleDeleteOffer={handleDeleteOffer}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {selectedOffer && (
        <div className="w-1/2 pl-[2rem] bg-white shadow-md">
          <Button className="mb-5" onClick={() => setSelectedOffer(null)}>
            <ArrowLeft size={24} /> Retour
          </Button>
          <h2 className="text-xl font-bold mb-4">Détails de l'offre</h2>
          <p className="mb-2 w-[90%]" ><strong>Poste:</strong> <br/>{selectedOffer.job_title}</p>
          <p className="mb-2 w-[90%]"><strong>Entreprise:</strong> <br/>{selectedOffer.company}</p>
          <p className="mb-2 w-[90%]"><strong>Date de publication:</strong> <br/>{new Date(selectedOffer.posted_at).toLocaleDateString()}</p>
          <p className="mb-2 w-[90%]"><strong>Description:</strong> <br/>{selectedOffer.content}</p>
          <p className="mb-2 w-[90%]"><strong>Recommandations:</strong> <br/>{selectedOffer.recommendations}</p>
          <p className="mb-2 w-[90%]"><strong>Site Web:</strong> <br/><a href={selectedOffer.link} className="text-blue-600" target="_blank">Visiter</a></p>
          <p className="mb-2 w-[90%]"><strong>Description de l'entreprise:</strong> <br/>{selectedOffer.company_description}</p>
        </div>
      )}
    </div>
  );
  function RowActions({
    offer,
    setSelectedOffer,
    handleDeleteOffer,
  }: {
    offer: Offer;
    setSelectedOffer: (offer: Offer) => void;
    handleDeleteOffer: (offer: Offer) => void;
  }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button size="icon" variant="ghost" className="shadow-none" aria-label="Edit item">
              <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setSelectedOffer(offer)}>Voir</DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                  Supprimer
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Vous allez supprimer l'offre "{offer.job_title}" de "{offer.company}" publiée le{" "}
                    {new Date(offer.posted_at).toLocaleDateString()}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteOffer(offer)}>Supprimer</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
}
