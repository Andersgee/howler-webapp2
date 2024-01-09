import type { RawBuilder } from "kysely";

export type MysqlDB = {
	//https://dev.mysql.com/doc/refman/8.0/en/information-schema-columns-table.html
	"information_schema.COLUMNS": {
		TABLE_CATALOG: string;
		TABLE_SCHEMA: string | RawBuilder<unknown>;
		TABLE_NAME: string;
		COLUMN_NAME: string;
		ORDINAL_POSITION: number;
		COLUMN_DEFAULT: string | null;
		IS_NULLABLE: "YES" | "NO";
		DATA_TYPE: string;
		CHARACTER_MAXIMUM_LENGTH: number;
		CHARACTER_OCTET_LENGTH: number;
		NUMERIC_PRECISION: bigint | null;
		NUMERIC_SCALE: bigint | null;
		DATETIME_PRECISION: number | null;
		CHARACTER_SET_NAME: string;
		COLLATION_NAME: string;
		COLUMN_TYPE: string;
		COLUMN_KEY: string;
		EXTRA:
			| ""
			| "auto_increment"
			| "on update CURRENT_TIMESTAMP"
			| "STORED GENERATED"
			| "VIRTUAL GENERATED"
			| "DEFAULT_GENERATED";
		PRIVILEGES: string;
		COLUMN_COMMENT: string;
		GENERATION_EXPRESSION: string;
		SRS_ID: string;
	};
	//https://dev.mysql.com/doc/refman/8.0/en/information-schema-key-column-usage-table.html
	"information_schema.KEY_COLUMN_USAGE": {
		CONSTRAINT_CATALOG: "def";
		CONSTRAINT_SCHEMA: string;
		CONSTRAINT_NAME: string;
		TABLE_CATALOG: "def";
		TABLE_SCHEMA: string | RawBuilder<unknown>;
		TABLE_NAME: string;
		COLUMN_NAME: string;
		ORDINAL_POSITION: number;
		POSITION_IN_UNIQUE_CONSTRAINT: number | null;
		REFERENCED_TABLE_SCHEMA: string | null;
		REFERENCED_TABLE_NAME: string | null;
		REFERENCED_COLUMN_NAME: string | null;
	};
	//https://dev.mysql.com/doc/refman/8.0/en/information-schema-table-constraints-table.html
	"information_schema.TABLE_CONSTRAINTS": {
		CONSTRAINT_CATALOG: string;
		CONSTRAINT_SCHEMA: string;
		CONSTRAINT_NAME: string;
		TABLE_SCHEMA: string | RawBuilder<unknown>;
		TABLE_NAME: string;
		CONSTRAINT_TYPE: string;
		ENFORCED: string;
	};
	//https://dev.mysql.com/doc/refman/8.0/en/information-schema-tables-table.html
	"information_schema.TABLES": {
		TABLE_CATALOG: string;
		TABLE_SCHEMA: string | RawBuilder<unknown>;
		TABLE_NAME: string;
		TABLE_TYPE: string;
		ENGINE: string;
		VERSION: string;
		ROW_FORMAT: string;
		TABLE_ROWS: string;
		AVG_ROW_LENGTH: string;
		DATA_LENGTH: string;
		MAX_DATA_LENGTH: string;
		INDEX_LENGTH: string;
		DATA_FREE: string;
		AUTO_INCREMENT: string;
		CREATE_TIME: string;
		UPDATE_TIME: string;
		CHECK_TIME: string;
		TABLE_COLLATION: string;
		CHECKSUM: string;
		CREATE_OPTIONS: string;
		TABLE_COMMENT: string;
	};
	//https://dev.mysql.com/doc/refman/8.0/en/information-schema-referential-constraints-table.html
	//this has ondelete and onupdate info for constraints
	"information_schema.REFERENTIAL_CONSTRAINTS": {
		CONSTRAINT_CATALOG: "def";
		CONSTRAINT_SCHEMA: string;
		CONSTRAINT_NAME: string;
		UNIQUE_CONSTRAINT_CATALOG: "def";
		UNIQUE_CONSTRAINT_SCHEMA: string;
		UNIQUE_CONSTRAINT_NAME: string;
		MATCH_OPTION: null;
		UPDATE_RULE: "CASCADE" | "SET NULL" | "SET DEFAULT" | "RESTRICT" | "NO ACTION";
		DELETE_RULE: "CASCADE" | "SET NULL" | "SET DEFAULT" | "RESTRICT" | "NO ACTION";
		TABLE_NAME: string;
		REFERENCED_TABLE_NAME: string;
	};
	//https://dev.mysql.com/doc/refman/8.0/en/information-schema-statistics-table.html
	//information about table indexes
	"information_schema.STATISTICS": {
		TABLE_CATALOG: "def";
		TABLE_SCHEMA: string | RawBuilder<unknown>;
		TABLE_NAME: string;
		NON_UNIQUE: 0 | 1;
		INDEX_SCHEMA: string;
		INDEX_NAME: string;
		SEQ_IN_INDEX: number;
		/**
		 * note: index can technically be an expression like "(col1 + col2)", see: https://dev.mysql.com/doc/refman/8.0/en/create-index.html#create-index-functional-key-parts
		 * if so, COLUMN_NAME is null and that string is in EXPRESSION.
		 * but this is not relevant in schema.prisma land
		 * */
		COLUMN_NAME: string | null;
		EXPRESSION: string | null;
		COLLATION: "A" | "D" | null;
		CARDINALITY: number;
		SUB_PART: string | null;
		PACKED: string | null;
		NULLABLE: "YES" | "";
		INDEX_TYPE: string;
		COMMENT: string;
		INDEX_COMMENT: string;
		IS_VISIBLE: string;
	};
};
