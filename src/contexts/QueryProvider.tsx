"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

interface IQueryProvider {
    children: React.ReactNode

}

const QueryProvider = ({ children }: IQueryProvider) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default QueryProvider;