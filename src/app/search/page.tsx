"use client";

import { KeywordSearch } from "@/components/search/KeywordSearch";
import { NaturalLanguageSearch } from "@/components/search/NaturalLanguageSearch";
import { SearchLoadingState } from "@/components/search/SearchLoadingState";
import { SearchResults } from "@/components/search/SearchResults";
import { useSearch } from "@/hooks/useSearch";

export default function SearchPage(){const {results,loading,error,search}=useSearch();return <main className="mx-auto max-w-7xl space-y-5 px-4 py-8"><div><h1 className="text-2xl font-black">Supplier Search</h1><p className="text-sm text-navy-500">Keyword/category search and AI-assisted natural-language search.</p></div><KeywordSearch onSearch={(query,category)=>search({query,category,use_ai:false})}/><NaturalLanguageSearch onSearch={(query)=>search({query,use_ai:true})}/>{error&&<p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{loading?<SearchLoadingState/>:<SearchResults results={results}/>}</main>}
