/**
 * Builder.io Layout Schema for PostgreSQL Storage
 *
 * This file defines the structure and types for storing Builder.io layouts in PostgreSQL.
 */

// Interface for Builder.io layout data
export interface BuilderLayout {
	id: string;
	name: string;
	content: any; // JSON structure of Builder.io layout
	channel?: string;
	createdAt: Date;
	updatedAt: Date;
	isActive: boolean;
}

// Interface for Builder.io layout metadata
export interface BuilderLayoutMetadata {
	id: string;
	name: string;
	channel?: string;
	createdAt: Date;
	updatedAt: Date;
	isActive: boolean;
}

// Interface for Builder.io layout creation input
export interface CreateBuilderLayoutInput {
	name: string;
	content: any;
	channel?: string;
	isActive?: boolean;
}

// Interface for Builder.io layout update input
export interface UpdateBuilderLayoutInput {
	id: string;
	name?: string;
	content?: any;
	channel?: string;
	isActive?: boolean;
}
